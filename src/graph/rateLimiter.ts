import pLimit from 'p-limit'

export type GraphRequestPriority = 'high' | 'low'

export interface GraphFetchOptions {
  priority?: GraphRequestPriority
  maxRetries?: number
}

type ResolvedGraphFetchOptions = Required<GraphFetchOptions>

interface GraphRateLimitContext {
  input: RequestInfo | URL
  method?: string
  priority: GraphRequestPriority
  retry: number
  maxRetries: number
}

const DEFAULT_MAX_RETRIES = 2
const THROTTLED_STATUS_CODES = new Set([429, 503])

// Microsoft Graph recommends exponential backoff when Retry-After isn't returned:
// https://learn.microsoft.com/en-us/graph/throttling
// The Microsoft Graph SDK retry delay defaults to 3 seconds and allows up to 180 seconds:
// https://learn.microsoft.com/en-us/dotnet/api/microsoft.graph.retryhandleroption.delay
const FALLBACK_RETRY_BASE_DELAY_MS = 3_000
const FALLBACK_RETRY_MAX_DELAY_MS = 180_000
const LOW_PRIORITY_CONCURRENCY = 2

let globalBackoffUntil = 0
let lowPriorityBackoffUntil = 0
const lowPriorityLimit = pLimit(LOW_PRIORITY_CONCURRENCY)

export const parseRetryAfterMs = (retryAfter: string | null): number | undefined => {
  if (!retryAfter) return undefined

  const seconds = Number(retryAfter)
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000)
  }

  const date = Date.parse(retryAfter)
  if (Number.isNaN(date)) return undefined

  return Math.max(0, date - Date.now())
}

export const parseRateLimitResetMs = (rateLimitReset: string | null): number | undefined => {
  if (!rateLimitReset) return undefined

  const seconds = Number(rateLimitReset)
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000)
  }

  const date = Date.parse(rateLimitReset)
  if (Number.isNaN(date)) return undefined

  return Math.max(0, date - Date.now())
}

export const getGraphRetryDelayMs = (headers: Headers): number | undefined => {
  const retryAfterMs = parseRetryAfterMs(headers.get('Retry-After'))
  const rateLimitResetMs = parseRateLimitResetMs(headers.get('RateLimit-Reset'))
  const delays = [retryAfterMs, rateLimitResetMs].filter((delay): delay is number => delay !== undefined)

  if (delays.length === 0) return undefined

  return Math.max(...delays)
}

const getFallbackRetryDelayMs = (retry: number) =>
  Math.min(FALLBACK_RETRY_BASE_DELAY_MS * (2 ** retry), FALLBACK_RETRY_MAX_DELAY_MS)

const getRequestUrl = (input: RequestInfo | URL) => {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()

  return input.url
}

const logGraphRateLimit = (
  message: string,
  context: GraphRateLimitContext,
  headers: Headers,
  status: number,
  delayMs: number,
) => {
  console.warn(`[Graph] ${message}`, {
    status,
    method: context.method ?? 'GET',
    url: getRequestUrl(context.input),
    priority: context.priority,
    retry: context.retry,
    maxRetries: context.maxRetries,
    delayMs,
    retryAfter: headers.get('Retry-After'),
    rateLimitReset: headers.get('RateLimit-Reset'),
    rateLimitRemaining: headers.get('RateLimit-Remaining'),
    rateLimitLimit: headers.get('RateLimit-Limit'),
    throttleLimitPercentage: headers.get('x-ms-throttle-limit-percentage'),
  })
}

const sleep = (ms: number, signal?: AbortSignal): Promise<void> => {
  if (ms <= 0) return Promise.resolve()

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
      return
    }

    const timeout = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, ms)

    const handleAbort = () => {
      window.clearTimeout(timeout)
      reject(signal?.reason ?? new DOMException('Aborted', 'AbortError'))
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

const waitForBackoff = async (priority: GraphRequestPriority, signal?: AbortSignal) => {
  const now = Date.now()
  const backoffUntil = priority === 'low'
    ? Math.max(globalBackoffUntil, lowPriorityBackoffUntil)
    : globalBackoffUntil

  await sleep(backoffUntil - now, signal)
}

const updateBackoffFromHeaders = (headers: Headers, status: number, context: GraphRateLimitContext) => {
  const now = Date.now()
  const retryDelayMs = getGraphRetryDelayMs(headers)
  const rateLimitRemainingHeader = headers.get('RateLimit-Remaining')
  const rateLimitLimitHeader = headers.get('RateLimit-Limit')
  const rateLimitRemaining = rateLimitRemainingHeader === null ? undefined : Number(rateLimitRemainingHeader)
  const rateLimitLimit = rateLimitLimitHeader === null ? undefined : Number(rateLimitLimitHeader)
  const isGlobalBackoffTriggered = THROTTLED_STATUS_CODES.has(status) || rateLimitRemaining === 0
  let hasLoggedLowPriorityBackoff = false

  if (isGlobalBackoffTriggered) {
    const delayMs = retryDelayMs ?? getFallbackRetryDelayMs(context.retry)
    globalBackoffUntil = Math.max(globalBackoffUntil, now + delayMs)
    logGraphRateLimit('Rate limit triggered; backing off Graph requests.', context, headers, status, delayMs)
  }

  // Microsoft Graph files/lists resources (drive, driveItem, etc.) use SharePoint limits:
  // https://learn.microsoft.com/en-us/graph/throttling-limits#files-and-lists-service-limits
  // RateLimit headers are emitted near quota pressure and include RateLimit-Reset;
  // https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online#ratelimit-headers---preview
  if (
    rateLimitRemaining !== undefined
    && rateLimitLimit !== undefined
    && Number.isFinite(rateLimitRemaining)
    && Number.isFinite(rateLimitLimit)
    && rateLimitLimit > 0
    && rateLimitRemaining / rateLimitLimit < 0.2
  ) {
    const delayMs = retryDelayMs ?? FALLBACK_RETRY_BASE_DELAY_MS
    lowPriorityBackoffUntil = Math.max(lowPriorityBackoffUntil, now + delayMs)
    if (!isGlobalBackoffTriggered) {
      logGraphRateLimit('Rate limit quota is low; backing off low-priority Graph requests.', context, headers, status, delayMs)
      hasLoggedLowPriorityBackoff = true
    }
  }

  const throttleLimitPercentage = Number(headers.get('x-ms-throttle-limit-percentage'))
  if (Number.isFinite(throttleLimitPercentage) && throttleLimitPercentage >= 0.8) {
    const delayMs = retryDelayMs ?? FALLBACK_RETRY_BASE_DELAY_MS
    lowPriorityBackoffUntil = Math.max(lowPriorityBackoffUntil, now + delayMs)
    if (!isGlobalBackoffTriggered && !hasLoggedLowPriorityBackoff) {
      logGraphRateLimit('Throttle limit is high; backing off low-priority Graph requests.', context, headers, status, delayMs)
    }
  }
}

const runGraphFetch = async (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  options: ResolvedGraphFetchOptions,
): Promise<Response> => {
  const signal = init?.signal ?? undefined

  for (let retry = 0; retry <= options.maxRetries; retry += 1) {
    await waitForBackoff(options.priority, signal)

    const headers = new Headers(init?.headers)

    // Priority header docs:
    // https://learn.microsoft.com/en-us/graph/throttling-limits
    headers.set('x-ms-throttle-priority', options.priority === 'low' ? 'Low' : 'High')

    const response = await fetch(input, {
      ...init,
      headers,
    })

    updateBackoffFromHeaders(response.headers, response.status, {
      input,
      method: init?.method,
      priority: options.priority,
      retry,
      maxRetries: options.maxRetries,
    })

    if (!THROTTLED_STATUS_CODES.has(response.status) || retry >= options.maxRetries) {
      return response
    }
  }

  throw new Error('Unexpected Graph fetch retry state.')
}

const enqueueLowPriorityFetch = (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  options: ResolvedGraphFetchOptions,
): Promise<Response> => lowPriorityLimit(() => runGraphFetch(input, init, options))

export const graphFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
  {
    priority = 'high',
    maxRetries = DEFAULT_MAX_RETRIES,
  }: GraphFetchOptions = {},
): Promise<Response> => {
  const options = { priority, maxRetries }

  if (priority === 'low') {
    return enqueueLowPriorityFetch(input, init, options)
  }

  return runGraphFetch(input, init, options)
}
