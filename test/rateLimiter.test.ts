import { afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { rateLimitedFetch } from './rateLimiter.ts'

const originalFetch = globalThis.fetch
const originalSetTimeout = globalThis.setTimeout
const originalWarn = console.warn

afterEach(() => {
  globalThis.fetch = originalFetch
  globalThis.setTimeout = originalSetTimeout
  console.warn = originalWarn
})

describe('rateLimitedFetch', () => {
  it('retries a network error without scheduling rate-limit backoff', async () => {
    let attempts = 0
    const scheduledDelays: number[] = []

    globalThis.fetch = async () => {
      attempts += 1
      if (attempts === 1) throw new TypeError('net::ERR_HTTP2_PROTOCOL_ERROR')
      return new Response(null, { status: 200 })
    }
    globalThis.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
      scheduledDelays.push(timeout ?? 0)
      return originalSetTimeout(handler, 0, ...args)
    }) as typeof globalThis.setTimeout
    console.warn = () => undefined

    const response = await rateLimitedFetch('https://example.test/file', undefined, {
      retryNetworkErrors: true,
      maxRetries: 1,
    })

    assert.equal(response.status, 200)
    assert.equal(attempts, 2)
    assert.deepEqual(scheduledDelays, [])
  })

  it('redacts sensitive content URLs and error objects from retry logs', async () => {
    const sensitiveUrl = 'https://media.files.1drv.com/file.mp3?authKey=sensitive'
    const warnings: unknown[][] = []
    let attempts = 0
    globalThis.fetch = async () => {
      attempts += 1
      if (attempts === 1) throw new TypeError(`Failed to fetch ${sensitiveUrl}`)
      return new Response(null, { status: 200 })
    }
    console.warn = (...args: unknown[]) => warnings.push(args)

    await rateLimitedFetch(sensitiveUrl, undefined, {
      retryNetworkErrors: true,
      maxRetries: 1,
      redactUrl: true,
    })

    assert.equal(JSON.stringify(warnings).includes(sensitiveUrl), false)
    assert.equal(JSON.stringify(warnings).includes('TypeError'), true)

    globalThis.fetch = async () => {
      throw new TypeError(`Failed to fetch ${sensitiveUrl}`)
    }
    await assert.rejects(
      rateLimitedFetch(sensitiveUrl, undefined, { redactUrl: true }),
      error => (
        error instanceof Error
        && error.name === 'TypeError'
        && !error.message.includes(sensitiveUrl)
      ),
    )
  })
})
