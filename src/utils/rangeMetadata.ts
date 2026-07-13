import type { FileNode } from '@/types/file'
import type { MetaData } from '@/types/metaData'
import { HttpRangeReader } from './rangeReader.ts'

type TextTags = Partial<{
  title: string
  artist: string
  albumartist: string
  album: string
  composer: string
  genre: string
  year: number
  track: number
  trackTotal: number
  disk: number
  diskTotal: number
  copyright: string
}>

const decoder = new TextDecoder()
const ascii = (bytes: Uint8Array) => String.fromCharCode(...bytes)
const u32be = (b: Uint8Array, o = 0) => new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(o)
const u32le = (b: Uint8Array, o = 0) => new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(o, true)
const syncSafe = (b: Uint8Array, o = 0) => ((b[o] & 0x7f) << 21) | ((b[o + 1] & 0x7f) << 14) | ((b[o + 2] & 0x7f) << 7) | (b[o + 3] & 0x7f)
const trim = (value: string) => value.replace(/\0/g, '').trim()
const numberPair = (value: string) => {
  const [no, of] = value.split('/').map(item => Number.parseInt(item, 10))
  return { no: Number.isFinite(no) ? no : undefined, of: Number.isFinite(of) ? of : undefined }
}

const decodeText = (bytes: Uint8Array, encoding = 3) => {
  if (bytes.length === 0) return ''
  if (encoding === 0) return trim(new TextDecoder('windows-1252').decode(bytes))
  if (encoding === 3) return trim(decoder.decode(bytes))
  if (encoding === 2) return trim(new TextDecoder('utf-16be').decode(bytes))
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return trim(new TextDecoder('utf-16le').decode(bytes.subarray(2)))
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return trim(new TextDecoder('utf-16be').decode(bytes.subarray(2)))
  return trim(new TextDecoder('utf-16le').decode(bytes))
}

const applyTag = (tags: TextTags, key: string, value: string) => {
  const normalized = key.toUpperCase()
  if (!value) return
  if (['TIT2', 'TT2', 'TITLE', '©NAM', 'INAM'].includes(normalized)) tags.title = value
  else if (['TPE1', 'TP1', 'ARTIST', '©ART', 'IART'].includes(normalized)) tags.artist = value
  else if (['TPE2', 'TP2', 'ALBUMARTIST', 'ALBUM ARTIST', 'AART'].includes(normalized)) tags.albumartist = value
  else if (['TALB', 'TAL', 'ALBUM', '©ALB', 'IPRD'].includes(normalized)) tags.album = value
  else if (['TCOM', 'TCM', 'COMPOSER', '©WRT', 'IWRI'].includes(normalized)) tags.composer = value
  else if (['TCON', 'TCO', 'GENRE', '©GEN', 'IGNR'].includes(normalized)) tags.genre = value
  else if (['TYER', 'TYE', 'TDRC', 'DATE', 'YEAR', '©DAY', 'ICRD'].includes(normalized)) tags.year = Number.parseInt(value, 10) || undefined
  else if (['TRCK', 'TRK', 'TRACKNUMBER'].includes(normalized)) Object.assign(tags, { track: numberPair(value).no, trackTotal: numberPair(value).of })
  else if (normalized === 'TRACKTOTAL' || normalized === 'TOTALTRACKS') tags.trackTotal = Number.parseInt(value, 10) || undefined
  else if (['TPOS', 'TPA', 'DISCNUMBER'].includes(normalized)) Object.assign(tags, { disk: numberPair(value).no, diskTotal: numberPair(value).of })
  else if (normalized === 'DISCTOTAL' || normalized === 'TOTALDISCS') tags.diskTotal = Number.parseInt(value, 10) || undefined
  else if (['TCOP', 'TCR', 'COPYRIGHT', 'ICOP'].includes(normalized)) tags.copyright = value
}

const parseId3 = async (reader: HttpRangeReader, base = 0, maxEnd = Number.POSITIVE_INFINITY): Promise<TextTags> => {
  const tags: TextTags = {}
  if (base + 10 > maxEnd) return tags
  const header = await reader.read(base, 10)
  if (ascii(header.subarray(0, 3)) !== 'ID3') return tags
  const version = header[3]
  const end = base + 10 + syncSafe(header, 6)
  if (end > maxEnd) return tags
  let offset = base + 10

  while (offset + 6 <= end) {
    const frameHeaderLength = version === 2 ? 6 : 10
    if (offset + frameHeaderLength > end) break
    const frameHeader = await reader.read(offset, frameHeaderLength)
    const idLength = version === 2 ? 3 : 4
    const id = ascii(frameHeader.subarray(0, idLength))
    if (!new RegExp(`^[A-Z0-9]{${idLength}}$`).test(id)) break
    const size = version === 2
      ? (frameHeader[3] << 16) | (frameHeader[4] << 8) | frameHeader[5]
      : version === 4 ? syncSafe(frameHeader, 4) : u32be(frameHeader, 4)
    offset += frameHeaderLength
    if (size <= 0 || offset + size > end) break

    if (id.startsWith('T') && id !== 'TXXX') {
      const data = await reader.read(offset, size)
      applyTag(tags, id, decodeText(data.subarray(1), data[0]))
    } else if (id === 'COMM' && size > 4) {
      const data = await reader.read(offset, size)
      const encoding = data[0]
      const separator = encoding === 0 || encoding === 3 ? 1 : 2
      let pos = 4
      while (pos + separator <= data.length && data.subarray(pos, pos + separator).some(byte => byte !== 0)) pos += separator
      const value = decodeText(data.subarray(pos + separator), encoding)
      if (value && !tags.title) applyTag(tags, 'COMMENT', value)
    }
    offset += size
  }

  return tags
}

const parseId3v1 = async (reader: HttpRangeReader, fileSize: number): Promise<TextTags> => {
  if (fileSize < 128) return {}
  const data = await reader.read(fileSize - 128, 128)
  if (ascii(data.subarray(0, 3)) !== 'TAG') return {}
  const tags: TextTags = {}
  applyTag(tags, 'TITLE', decodeText(data.subarray(3, 33), 0))
  applyTag(tags, 'ARTIST', decodeText(data.subarray(33, 63), 0))
  applyTag(tags, 'ALBUM', decodeText(data.subarray(63, 93), 0))
  applyTag(tags, 'YEAR', decodeText(data.subarray(93, 97), 0))
  if (data[125] === 0 && data[126] > 0) tags.track = data[126]
  return tags
}

const parseFlacComments = async (reader: HttpRangeReader, start: number, length: number): Promise<TextTags> => {
  const tags: TextTags = {}
  const end = start + length
  let offset = start
  const vendorLength = u32le(await reader.read(offset, 4)); offset += 4 + vendorLength
  const count = u32le(await reader.read(offset, 4)); offset += 4

  for (let index = 0; index < count && offset + 4 <= end; index += 1) {
    const commentLength = u32le(await reader.read(offset, 4)); offset += 4
    if (offset + commentLength > end) throw new Error('Invalid FLAC comment length.')
    const prefixLength = Math.min(commentLength, 128)
    const prefix = await reader.read(offset, prefixLength)
    const prefixText = decoder.decode(prefix)
    const separator = prefixText.indexOf('=')
    const key = separator < 0 ? '' : prefixText.slice(0, separator).toUpperCase()

    if (!['METADATA_BLOCK_PICTURE', 'COVERART', 'COVERARTMIME'].includes(key)) {
      const rest = commentLength > prefixLength
        ? await reader.read(offset + prefixLength, commentLength - prefixLength)
        : new Uint8Array()
      const value = decoder.decode(concatBytes(prefix, rest))
      const valueSeparator = value.indexOf('=')
      if (valueSeparator > 0) applyTag(tags, value.slice(0, valueSeparator), trim(value.slice(valueSeparator + 1)))
    }
    offset += commentLength
  }
  return tags
}

const parseFlac = async (reader: HttpRangeReader): Promise<TextTags> => {
  let offset = 4
  while (true) {
    const header = await reader.read(offset, 4)
    const last = (header[0] & 0x80) !== 0
    const type = header[0] & 0x7f
    const length = (header[1] << 16) | (header[2] << 8) | header[3]
    offset += 4
    if (type === 4) return parseFlacComments(reader, offset, length)
    offset += length
    if (last) return {}
  }
}

type Atom = { name: string, start: number, dataStart: number, end: number }
const readAtom = async (reader: HttpRangeReader, start: number, parentEnd: number): Promise<Atom | null> => {
  if (start + 8 > parentEnd) return null
  const header = await reader.read(start, 8)
  let size = u32be(header)
  const name = ascii(header.subarray(4, 8))
  let headerSize = 8
  if (size === 1) {
    const large = await reader.read(start + 8, 8)
    size = Number(new DataView(large.buffer, large.byteOffset).getBigUint64(0))
    headerSize = 16
  } else if (size === 0) size = parentEnd - start
  if (size < headerSize || start + size > parentEnd) return null
  return { name, start, dataStart: start + headerSize, end: start + size }
}

const parseMp4 = async (reader: HttpRangeReader, fileSize: number): Promise<TextTags> => {
  const tags: TextTags = {}
  const containers = new Set(['moov', 'udta', 'meta', 'ilst'])
  const walk = async (start: number, end: number, inIlst = false) => {
    let offset = start
    while (offset + 8 <= end) {
      const atom = await readAtom(reader, offset, end)
      if (!atom) break
      if (containers.has(atom.name)) {
        await walk(atom.dataStart + (atom.name === 'meta' ? 4 : 0), atom.end, atom.name === 'ilst' || inIlst)
      } else if (inIlst && atom.name !== 'covr') {
        let childOffset = atom.dataStart
        while (childOffset + 16 <= atom.end) {
          const child = await readAtom(reader, childOffset, atom.end)
          if (!child) break
          if (child.name === 'data' && child.end - child.dataStart >= 8) {
            const payload = await reader.read(child.dataStart + 8, child.end - child.dataStart - 8)
            if (atom.name === 'trkn' && payload.length >= 6) {
              tags.track = (payload[2] << 8) | payload[3]
              tags.trackTotal = (payload[4] << 8) | payload[5]
            } else if (atom.name === 'disk' && payload.length >= 6) {
              tags.disk = (payload[2] << 8) | payload[3]
              tags.diskTotal = (payload[4] << 8) | payload[5]
            } else applyTag(tags, atom.name, trim(decoder.decode(payload)))
          }
          childOffset = child.end
        }
      }
      offset = atom.end
    }
  }
  await walk(0, fileSize)
  return tags
}

const parseWav = async (reader: HttpRangeReader, fileSize: number): Promise<TextTags> => {
  const tags: TextTags = {}
  let offset = 12
  while (offset + 8 <= fileSize) {
    const header = await reader.read(offset, 8)
    const id = ascii(header.subarray(0, 4))
    const size = u32le(header, 4)
    const dataStart = offset + 8
    const dataEnd = dataStart + size
    if (dataEnd > fileSize) break
    if (id === 'ID3 ' || id === 'id3 ') Object.assign(tags, await parseId3(reader, dataStart, dataEnd))
    if (id === 'LIST' && size >= 4 && ascii(await reader.read(dataStart, 4)) === 'INFO') {
      let itemOffset = dataStart + 4
      while (itemOffset + 8 <= dataEnd) {
        const itemHeader = await reader.read(itemOffset, 8)
        const itemSize = u32le(itemHeader, 4)
        const itemDataStart = itemOffset + 8
        const itemDataEnd = itemDataStart + itemSize
        if (itemDataEnd > dataEnd) break
        applyTag(tags, ascii(itemHeader.subarray(0, 4)), trim(decoder.decode(await reader.read(itemDataStart, itemSize))))
        itemOffset = itemDataEnd + (itemSize % 2)
      }
    }
    offset = dataEnd + (size % 2)
  }
  return tags
}

type OggSegment = { offset: number, length: number }

class OggPacketReader {
  private position = 0
  private readonly reader: HttpRangeReader
  private readonly segments: OggSegment[]

  constructor(reader: HttpRangeReader, segments: OggSegment[]) {
    this.reader = reader
    this.segments = segments
  }

  async read(length: number): Promise<Uint8Array> {
    const output = new Uint8Array(length)
    let outputOffset = 0
    let logicalOffset = 0

    for (const segment of this.segments) {
      const segmentEnd = logicalOffset + segment.length
      if (this.position < segmentEnd && outputOffset < length) {
        const withinSegment = Math.max(0, this.position - logicalOffset)
        const take = Math.min(segment.length - withinSegment, length - outputOffset)
        output.set(await this.reader.read(segment.offset + withinSegment, take), outputOffset)
        this.position += take
        outputOffset += take
      }
      logicalOffset = segmentEnd
      if (outputOffset === length) return output
    }
    throw new Error('Unexpected end of Ogg packet.')
  }

  skip(length: number) {
    this.position += length
  }
}

const parseOgg = async (reader: HttpRangeReader, fileSize: number): Promise<TextTags> => {
  const packets: OggSegment[][] = []
  let currentPacket: OggSegment[] = []
  let offset = 0

  while (offset + 27 <= fileSize && packets.length < 2) {
    const header = await reader.read(offset, 27)
    if (ascii(header.subarray(0, 4)) !== 'OggS') break
    const segmentCount = header[26]
    const lacing = await reader.read(offset + 27, segmentCount)
    let payloadOffset = offset + 27 + segmentCount

    for (const segmentLength of lacing) {
      currentPacket.push({ offset: payloadOffset, length: segmentLength })
      payloadOffset += segmentLength
      if (segmentLength < 255) {
        packets.push(currentPacket)
        currentPacket = []
      }
    }
    offset = payloadOffset
  }

  if (packets.length < 2) return {}
  const packet = new OggPacketReader(reader, packets[1])
  const signature = await packet.read(8)
  if (ascii(signature.subarray(0, 7)) === '\x03vorbis') packet.skip(-1)
  else if (ascii(signature) !== 'OpusTags') return {}

  const vendorLength = u32le(await packet.read(4))
  packet.skip(vendorLength)
  const count = u32le(await packet.read(4))
  const tags: TextTags = {}

  for (let index = 0; index < count; index += 1) {
    const length = u32le(await packet.read(4))
    const prefixLength = Math.min(length, 128)
    const prefix = await packet.read(prefixLength)
    const prefixText = decoder.decode(prefix)
    const separator = prefixText.indexOf('=')
    const key = separator < 0 ? '' : prefixText.slice(0, separator).toUpperCase()
    const remaining = length - prefixLength

    if (['METADATA_BLOCK_PICTURE', 'COVERART', 'COVERARTMIME'].includes(key)) {
      packet.skip(remaining)
      continue
    }

    const rest = remaining > 0 ? await packet.read(remaining) : new Uint8Array()
    const value = decoder.decode(new Uint8Array([...prefix, ...rest]))
    const valueSeparator = value.indexOf('=')
    if (valueSeparator > 0) applyTag(tags, value.slice(0, valueSeparator), trim(value.slice(valueSeparator + 1)))
  }

  return tags
}

const filenameTitle = (name: string) => name.replace(/\.[^.]+$/, '').trim() || name

export const getRangeMetadata = async (file: FileNode, url: string, signal?: AbortSignal): Promise<MetaData> => {
  const reader = new HttpRangeReader(url, undefined, signal)
  const signature = await reader.read(0, Math.min(4, file.size))
  let tags: TextTags = {}

  if (ascii(signature.subarray(0, 3)) === 'ID3') tags = await parseId3(reader, 0, file.size)
  else if (ascii(signature.subarray(0, 4)) === 'fLaC') tags = await parseFlac(reader)
  else if (ascii(signature.subarray(0, 4)) === 'OggS') tags = await parseOgg(reader, file.size)
  else if (file.size >= 12) {
    const extendedSignature = concatBytes(signature, await reader.read(4, 8))
    if (ascii(extendedSignature.subarray(4, 8)) === 'ftyp') tags = await parseMp4(reader, file.size)
    else if (ascii(signature) === 'RIFF' && ascii(extendedSignature.subarray(8, 12)) === 'WAVE') tags = await parseWav(reader, file.size)
  }

  if (/\.mp3$/i.test(file.name) && !tags.title) {
    tags = { ...await parseId3v1(reader, file.size), ...tags }
  }

  return {
    id: file.id,
    source: tags.title ? 'range' : 'filename',
    format: {},
    native: {},
    quality: { warnings: [] },
    common: {
      title: tags.title ?? filenameTitle(file.name),
      artist: tags.artist,
      artists: tags.artist ? [tags.artist] : undefined,
      albumartist: tags.albumartist,
      album: tags.album,
      composer: tags.composer ? [tags.composer] : undefined,
      genre: tags.genre ? [tags.genre] : undefined,
      year: tags.year,
      track: { no: tags.track, of: tags.trackTotal },
      disk: { no: tags.disk, of: tags.diskTotal },
      copyright: tags.copyright ? [tags.copyright] : undefined,
    },
  }
}

const concatBytes = (...parts: Uint8Array[]) => {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0))
  let offset = 0
  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }
  return output
}
