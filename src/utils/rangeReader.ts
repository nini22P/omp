import { rateLimitedFetch } from '../graph/rateLimiter.ts'

export class RangeBudgetExceededError extends Error {
  constructor() {
    super('Range download budget exceeded.')
  }
}

export class RangeNotSupportedError extends Error {
  constructor(details?: string) {
    super(`Server did not return a valid partial response${details ? `: ${details}` : '.'}`)
  }
}

export class RangeRequestError extends Error {
  readonly reason: string

  constructor(reason: string) {
    super('Range request failed.')
    this.reason = reason
  }
}

const MAX_REQUEST_SIZE = 64 * 1024

export class HttpRangeReader {
  private transferred = 0
  private readonly cache: Array<{ start: number, end: number, bytes: Uint8Array }> = []
  private readonly url: string
  private readonly budget: number
  private readonly signal?: AbortSignal

  constructor(url: string, budget = 1024 * 1024, signal?: AbortSignal) {
    this.url = url
    this.budget = budget
    this.signal = signal
  }

  get bytesTransferred() {
    return this.transferred
  }

  async read(offset: number, length: number): Promise<Uint8Array> {
    this.throwIfAborted()

    if (offset < 0 || length < 0 || !Number.isSafeInteger(offset) || !Number.isSafeInteger(length)) {
      throw new RangeError('Invalid byte range.')
    }

    const result = new Uint8Array(length)
    let written = 0

    while (written < length) {
      this.throwIfAborted()
      const chunkLength = Math.min(MAX_REQUEST_SIZE, length - written)
      const start = offset + written
      const end = start + chunkLength - 1
      const cached = this.cache.find(entry => entry.start <= start && entry.end >= end)
      if (cached) {
        result.set(cached.bytes.subarray(start - cached.start, end - cached.start + 1), written)
        written += chunkLength
        continue
      }

      if (this.transferred + chunkLength > this.budget) throw new RangeBudgetExceededError()
      const response = await this.fetchRange(start, end)

      if (response.status !== 206) {
        await response.body?.cancel()
        throw new RangeNotSupportedError(`status=${response.status}, requested=${start}-${end}`)
      }

      const contentRange = response.headers.get('Content-Range')
      const match = contentRange?.match(/^bytes (\d+)-(\d+)\/(\d+|\*)$/)
      let responseStart = match ? Number(match[1]) : start
      let responseEnd = match ? Number(match[2]) : end
      if (match && (responseStart > start || responseEnd < end)) {
        await response.body?.cancel()
        throw new RangeNotSupportedError(`Content-Range=${contentRange ?? 'missing'}, requested=${start}-${end}`)
      }

      const contentLengthHeader = response.headers.get('Content-Length')
      const contentLength = contentLengthHeader === null ? undefined : Number(contentLengthHeader)
      if (contentLength !== undefined && Number.isFinite(contentLength) && this.transferred + contentLength > this.budget) {
        await response.body?.cancel()
        throw new RangeBudgetExceededError()
      }

      const bytes = new Uint8Array(await response.arrayBuffer())
      if (!match) {
        if (bytes.byteLength < chunkLength) {
          throw new RangeNotSupportedError(`received=${bytes.byteLength}, requested=${start}-${end}, Content-Range is not exposed`)
        }
        // OneDrive may hide Content-Range from browser code while returning a
        // valid 206 response. Treat the body as starting at the requested byte.
        responseStart = start
        responseEnd = start + bytes.byteLength - 1
      }
      const expectedLength = responseEnd - responseStart + 1
      if (bytes.byteLength !== expectedLength) {
        throw new RangeNotSupportedError(`received=${bytes.byteLength}, Content-Range=${contentRange}`)
      }
      this.transferred += bytes.byteLength
      if (this.transferred > this.budget) throw new RangeBudgetExceededError()
      this.cache.push({ start: responseStart, end: responseEnd, bytes })

      result.set(bytes.subarray(start - responseStart, end - responseStart + 1), written)
      written += chunkLength
    }

    return result
  }

  private async fetchRange(start: number, end: number) {
    try {
      return await rateLimitedFetch(
        this.url,
        { headers: { Range: `bytes=${start}-${end}` }, signal: this.signal },
        {
          priority: 'low',
          scope: 'Content',
          retryNetworkErrors: true,
          redactUrl: true,
        },
      )
    } catch (error) {
      throw new RangeRequestError(error instanceof Error ? error.name : typeof error)
    }
  }

  private throwIfAborted() {
    if (this.signal?.aborted) {
      throw this.signal.reason ?? new DOMException('Aborted', 'AbortError')
    }
  }
}
