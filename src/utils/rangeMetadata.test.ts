import { afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getRangeMetadata } from './rangeMetadata.ts'
import { HttpRangeReader, RangeBudgetExceededError, RangeNotSupportedError } from './rangeReader.ts'
import type { FileNode } from '@/types/file'

const originalFetch = globalThis.fetch
const concat = (...parts: Uint8Array[]) => {
  const result = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0))
  let offset = 0
  for (const part of parts) {
    result.set(part, offset)
    offset += part.length
  }
  return result
}

const ascii = (value: string) => new TextEncoder().encode(value)
const u32be = (value: number) => new Uint8Array([(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255])
const u32le = (value: number) => new Uint8Array([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255])
const syncSafe = (value: number) => new Uint8Array([(value >>> 21) & 127, (value >>> 14) & 127, (value >>> 7) & 127, value & 127])
const frame = (id: string, payload: Uint8Array) => concat(ascii(id), u32be(payload.length), new Uint8Array(2), payload)
const flacBlock = (type: number, payload: Uint8Array, last = false) => concat(
  new Uint8Array([(last ? 0x80 : 0) | type, (payload.length >>> 16) & 255, (payload.length >>> 8) & 255, payload.length & 255]),
  payload,
)

const mockRanges = (file: Uint8Array, status = 206) => {
  const requested: Array<[number, number]> = []
  globalThis.fetch = async (_input: string | URL | Request, init?: RequestInit) => {
    const range = new Headers(init?.headers).get('Range')!
    const match = range.match(/^bytes=(\d+)-(\d+)$/)!
    const start = Number(match[1])
    const end = Number(match[2])
    requested.push([start, end])
    if (status !== 206) return new Response(file, { status })
    return new Response(file.slice(start, end + 1), {
      status: 206,
      headers: { 'Content-Range': `bytes ${start}-${end}/${file.length}` },
    })
  }
  return requested
}

afterEach(() => { globalThis.fetch = originalFetch })

describe('HttpRangeReader', () => {
  it('rejects a server that ignores Range', async () => {
    mockRanges(new Uint8Array(32), 200)
    await assert.rejects(() => new HttpRangeReader('test').read(0, 4), RangeNotSupportedError)
  })

  it('enforces the cumulative byte budget before requesting excess bytes', async () => {
    const file = new Uint8Array(1024 * 1024 + 1)
    const requested = mockRanges(file)
    const reader = new HttpRangeReader('test')
    await reader.read(0, 1024 * 1024)
    await assert.rejects(() => reader.read(1024 * 1024, 1), RangeBudgetExceededError)
    assert.equal(requested.length, 16)
  })

  it('accepts and caches an aligned partial response covering the requested range', async () => {
    const file = new Uint8Array(1024).map((_, index) => index % 256)
    let requests = 0
    globalThis.fetch = async () => {
      requests += 1
      return new Response(file.slice(0, 512), {
        status: 206,
        headers: {
          'Content-Range': `bytes 0-511/${file.length}`,
          'Content-Length': '512',
        },
      })
    }
    const reader = new HttpRangeReader('test')

    assert.deepEqual(await reader.read(100, 4), file.slice(100, 104))
    assert.deepEqual(await reader.read(200, 4), file.slice(200, 204))
    assert.equal(requests, 1)
    assert.equal(reader.bytesTransferred, 512)
  })

  it('accepts a 206 response when CORS hides Content-Range', async () => {
    const file = new Uint8Array([10, 20, 30, 40])
    globalThis.fetch = async () => new Response(file, {
      status: 206,
      headers: { 'Content-Length': String(file.length) },
    })

    const reader = new HttpRangeReader('test')
    assert.deepEqual(await reader.read(0, 4), file)
    assert.equal(reader.bytesTransferred, 4)
  })
})

describe('getRangeMetadata', () => {
  it('extracts ID3 text frames without requesting APIC payload bytes', async () => {
    const title = frame('TIT2', concat(new Uint8Array([3]), ascii('Range title')))
    const picture = frame('APIC', new Uint8Array(200_000).fill(7))
    const artist = frame('TPE1', concat(new Uint8Array([3]), ascii('Range artist')))
    const body = concat(title, picture, artist)
    const file = concat(ascii('ID3'), new Uint8Array([3, 0, 0]), syncSafe(body.length), body, new Uint8Array(100))
    const requested = mockRanges(file)
    const pictureStart = 10 + title.length + 10
    const pictureEnd = pictureStart + 200_000 - 1
    const node = { id: '1', name: 'song.mp3', size: file.length } as FileNode

    const metadata = await getRangeMetadata(node, 'test')

    assert.equal(metadata.common.title, 'Range title')
    assert.equal(metadata.common.artist, 'Range artist')
    assert.equal(metadata.source, 'range')
    assert.equal(requested.some(([start, end]) => start <= pictureEnd && end >= pictureStart), false)
  })

  it('skips a FLAC PICTURE block and reads following Vorbis comments', async () => {
    const picture = new Uint8Array(200_000).fill(9)
    const vendor = ascii('test')
    const comment = ascii('TITLE=FLAC title')
    const comments = concat(u32le(vendor.length), vendor, u32le(1), u32le(comment.length), comment)
    const file = concat(ascii('fLaC'), flacBlock(6, picture), flacBlock(4, comments, true))
    const requested = mockRanges(file)
    const pictureStart = 8
    const pictureEnd = pictureStart + picture.length - 1
    const node = { id: '2', name: 'song.flac', size: file.length } as FileNode

    const metadata = await getRangeMetadata(node, 'test')

    assert.equal(metadata.common.title, 'FLAC title')
    assert.equal(requested.some(([start, end]) => start <= pictureEnd && end >= pictureStart), false)
  })
})
