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
})
