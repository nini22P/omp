import { AudioDetails, FileNode } from '@/types/file'
import { MetaData } from '@/types/metaData'

const filenameTitle = (name: string) => name.replace(/\.[^.]+$/, '').trim() || name
const clean = (value?: unknown) => typeof value === 'string' ? value.trim() || undefined : undefined
const positive = (value?: number) => typeof value === 'number' && Number.isFinite(value) && value > 0
  ? value
  : undefined

export const graphAudioToMetadata = (file: FileNode, audio?: AudioDetails): MetaData => {
  const graphTitle = clean(audio?.title)
  const artist = clean(audio?.artist)
  const albumartist = clean(audio?.albumArtist)
  const album = clean(audio?.album)
  const genre = clean(audio?.genre)
  const composer = clean(audio?.composers)
  const track = positive(audio?.track)
  const trackCount = positive(audio?.trackCount)
  const disk = positive(audio?.disc)
  const diskCount = positive(audio?.discCount)
  const duration = positive(audio?.duration)
  const bitrate = positive(audio?.bitrate)

  return {
    id: file.id,
    source: graphTitle ? 'graph' : 'filename',
    format: {
      duration: duration === undefined ? undefined : duration / 1000,
      bitrate: bitrate === undefined ? undefined : bitrate * 1000,
    },
    native: {},
    quality: { warnings: [] },
    common: {
      title: graphTitle ?? filenameTitle(file.name),
      artist,
      artists: artist ? [artist] : undefined,
      albumartist,
      album,
      composer: composer ? [composer] : undefined,
      genre: genre ? [genre] : undefined,
      year: positive(audio?.year),
      track: { no: track, of: trackCount },
      disk: { no: disk, of: diskCount },
      copyright: clean(audio?.copyright) ? [clean(audio?.copyright)!] : undefined,
    },
  }
}
