import { IPicture, parseWebStream } from 'music-metadata'
import { pinyin } from 'pinyin-pro'
import { toRomaji } from 'wanakana'
import { franc, francAll, } from 'franc-min'
import { FileNode, FileType, Track, RemoteItem } from './types/file'
import { QueuedTrack } from './types/playQueue'
import { MetaData } from './types/metaData'
import kanjiRomajiMap from '@/data/kanjiRomajiMap'

export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * 将时间转换为分钟
 * @param time 
 * @returns 
 */
export const timeShift = (time: number) => {
  const minute = Math.floor(time / 60).toFixed().toString().padStart(2, '0')
  const second = (time % 60).toFixed().toString().padStart(2, '0')
  return `${minute} : ${second}`
}

export const isAudio = (name: string) => (/.(wav|mp3|aac|ogg|flac|m4a|opus)$/i).test(name)
export const isVideo = (name: string) => (/.(mp4|mkv|avi|mov|rmvb|webm|flv)$/i).test(name)
export const isPicture = (name: string) => (/.(jpg|jpeg|png|bmp|webp|avif|tiff|gif|svg|ico)$/i.test(name))
export const isLyrics = (name: string) => (/.(lrc)$/i).test(name)
export const isSubtitle = (name: string) => (/.(ass|srt|ssa|vtt)$/i).test(name)

export const checkFileType = (name: string): FileType => {
  if (isAudio(name))
    return 'audio'
  if (isVideo(name))
    return 'video'
  if (isPicture(name))
    return 'picture'
  if (isLyrics(name))
    return 'lyrics'
  if (isSubtitle(name))
    return 'subtitle'
  return 'other'
}

/**
 * 创建随机播放队列，如果传入id时这首歌曲会排到第一
 * @param playQueue 播放队列
 * @param index 想要排第一的歌曲id
 * @returns 
 */
export const shufflePlayQueue = (playQueue: QueuedTrack[], index?: number) => {
  const randomPlayQueue = [...playQueue]
  for (let i = randomPlayQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomPlayQueue[i], randomPlayQueue[j]] = [randomPlayQueue[j], randomPlayQueue[i]]
  }
  if (index !== undefined)
    return randomPlayQueue.filter(item => item.index === index).concat(randomPlayQueue.filter(item => item.index !== index))
  else return randomPlayQueue
}

export const nowTime = () => {
  const dateTime = new Date()
  return `${dateTime.getFullYear}-${dateTime.getMonth}-${dateTime.getDay} ${dateTime.getHours}:${dateTime.getMinutes}`
}

export const sizeConv = (fileSize: number) => {
  return ((fileSize / 1024) < 1024)
    ? `${(fileSize / 1024).toFixed(2)} KB`
    : ((fileSize / 1024 / 1024) < 1024)
      ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
      : `${(fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`
}

/**
 * 根据 url 解析 json
 * @param url 
 * @returns 
 */
export const fetchJson = async (url: string) => {
  try {
    const response = await fetch(url)
    const json = response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}

export const hexToRgba = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1
  return [r, g, b, a]
}

export const blendHex = (colorHex1: string, colorHex2: string) => {
  const colorRGBA1 = hexToRgba(colorHex1)
  const colorRGBA2 = hexToRgba(colorHex2)
  const red = colorRGBA1[0] * (1 - colorRGBA2[3]) + colorRGBA2[0] * colorRGBA2[3]
  const green = colorRGBA1[1] * (1 - colorRGBA2[3]) + colorRGBA2[1] * colorRGBA2[3]
  const blue = colorRGBA1[2] * (1 - colorRGBA2[3]) + colorRGBA2[2] * colorRGBA2[3]
  const color = [Math.round(red), Math.round(green), Math.round(blue)]
  return `rgb(${color.join(', ')})`
}

export const remoteItemToFileNode = (
  item: RemoteItem,
  options?: { includeVisuals?: boolean }
): FileNode => {
  const baseNode: FileNode = {
    id: item.id,
    parentId: item.parentReference.id,
    name: item.name,
    path: getRemotePath(item),
    type: checkFileType(item.name),
    size: item.size,
    lastModifiedDateTime: item.lastModifiedDateTime,
    metadataState: checkFileType(item.name) === 'audio' ? 'pending' : 'completed',
    cTag: item.cTag,
    folder: item.folder ? 1 : 0,
    childCount: item.folder?.childCount,
  }

  if (options?.includeVisuals) {
    baseNode.thumbnails = item.thumbnails
    baseNode.url = item['@microsoft.graph.downloadUrl']
  }

  return baseNode
}

export const fileNodeToTrack = (fileNode: FileNode | Track): Track => {
  return {
    id: fileNode.id,
    name: fileNode.name,
    path: fileNode.path,
    size: fileNode.size,
    cTag: fileNode.cTag,
  }
}

export const remoteItemToTrack = (item: RemoteItem): Track => {
  return {
    id: item.id,
    name: item.name,
    path: getRemotePath(item),
    size: item.size,
    cTag: item.cTag,
  }
}

export const getRemotePath = (item: RemoteItem) => item.parentReference.path
  ? [
    ...item.parentReference.path
      .replace('/drive/root:', '')
      .split('/')
      .filter(item => item.length > 0)
      .map(item => decodeURIComponent(item)),
    item.name,
  ]
  : []

export const compressImage = async (image: IPicture): Promise<IPicture> => {
  const blob = new Blob([image.data as unknown as ArrayBuffer], { type: image.format })
  const url = URL.createObjectURL(blob)
  const img = new Image()

  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = (err) => reject(new Error('Image failed to load: ' + err))
      img.src = url
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)

    const compressedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas toBlob failed to create a blob.'))
        }
      }, 'image/webp', 0.8)
    })

    const buffer = await compressedBlob.arrayBuffer()

    return {
      format: 'image/webp',
      data: new Uint8Array(buffer),
      description: image.description,
      type: image.type,
      name: image.name,
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const getNetMetaData = async (file: FileNode | Track, url: string): Promise<MetaData | null> => {
  try {
    const response = await fetch(url)

    if (response.body === null) {
      return null
    }

    const contentLength = response.headers.get('Content-Length')
    const size = contentLength ? parseInt(contentLength, 10) : undefined

    const metadata = await parseWebStream(
      response.body,
      {
        mimeType: response.headers.get('Content-Type') ?? undefined,
        size
      },
    )


    if (!metadata?.common?.title) {
      return null
    }

    console.log('Get net metadata: ', metadata)

    let compressedPictures: IPicture[] | undefined = undefined
    if (metadata.common.picture) {
      compressedPictures = await Promise.all(
        metadata.common.picture.map((item) => compressImage(item))
      )
    }

    const metaData: MetaData = {
      id: file.id,
      ...metadata,
      common: {
        ...metadata.common,
        title: metadata.common.title.trim(),
        picture: compressedPictures,
      }
    }

    return metaData

  } catch (error) {
    console.error('Failed to get net metadata', error)
    return null
  }
}

export const createImageUrl = (image: IPicture[]): string => {
  if (image && image.length > 0) {
    const blob = new Blob([image[0].data as unknown as ArrayBuffer], { type: image[0].format })
    return URL.createObjectURL(blob)
  }
  return './cover.svg'
}

export const fileSorter = (files: FileNode[], foldersFirst: boolean, sortBy: string, orderBy: string) => {
  return [...files].sort((a, b) => {
    if (foldersFirst) {
      if (a.folder === 1 && b.folder === 0) {
        return -1
      }
      if (a.folder === 0 && b.folder === 1) {
        return 1
      }
    }

    let compareResult = 0

    if (sortBy === 'name') {
      compareResult = fileModeNameCollator(a, b)
    } else if (sortBy === 'size') {
      compareResult = a.size - b.size
    } else if (sortBy === 'datetime' && a.lastModifiedDateTime && b.lastModifiedDateTime) {
      compareResult = new Date(a.lastModifiedDateTime).getTime() - new Date(b.lastModifiedDateTime).getTime()
    }

    return orderBy === 'asc' ? compareResult : -compareResult
  })
}

export const normalizeNameForSort = (name: string): string => {
  let normalized = name

  const kanjiRegex = new RegExp(Object.keys(kanjiRomajiMap).join('|'), 'g')

  if (/[ぁ-んァ-ン]/.test(normalized) || francAll(normalized).some(guess => guess[0] === 'jpn')) {
    normalized = normalized.replace(kanjiRegex, (match) => (kanjiRomajiMap[match as keyof typeof kanjiRomajiMap] || match))
    normalized = toRomaji(normalized, { upcaseKatakana: true })
  }
  else if (/[\u4e00-\u9fa5]/.test(normalized) || franc(normalized) === 'cmn') {
    normalized = pinyin(normalized, { toneType: 'none', nonZh: 'consecutive' })
  }

  return normalized
    .toLowerCase()
    .replace(/[._!"'()[\]-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function fileModeNameCollator(a: FileNode, b: FileNode): number {
  const normalizedA = normalizeNameForSort(a.name)
  const normalizedB = normalizeNameForSort(b.name)

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

  return collator.compare(normalizedA, normalizedB)
}