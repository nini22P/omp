import * as mm from 'music-metadata-browser'
import { FileItem, RemoteItem } from './types/file'
import { PlayQueueItem, PlayQueueStatus } from './types/playQueue'
import { Cover, MetaData } from './types/MetaData'

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

const isAudio = (name: string) => (/.(wav|mp3|aac|ogg|flac|m4a|opus)$/i).test(name)
const isVideo = (name: string) => (/.(mp4|mkv|avi|mov|rmvb|webm|flv)$/i).test(name)
const isPicture = (name: string) => (/.(jpg|jpeg|png|bmp|webp|avif|tiff|gif|svg|ico)$/i.test(name))

export const checkFileType = (name: string): FileItem['fileType'] => {
  if (isAudio(name))
    return 'audio'
  if (isVideo(name))
    return 'video'
  if (isPicture(name))
    return 'picture'
  return 'other'
}

/**
 * 创建随机播放队列，如果传入当前播放id时歌曲会排到第一
 * @param playQueue 播放队列
 * @param currentIndex 当前播放id
 * @returns 
 */
export const shufflePlayQueue = (playQueue: PlayQueueItem[], currentIndex?: PlayQueueStatus['currentIndex']) => {
  const randomPlayQueue = [...playQueue]
  for (let i = randomPlayQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomPlayQueue[i], randomPlayQueue[j]] = [randomPlayQueue[j], randomPlayQueue[i]]
  }
  if (currentIndex !== undefined)
    return randomPlayQueue.filter(item => item.index === currentIndex).concat(randomPlayQueue.filter(item => item.index !== currentIndex))
  else return randomPlayQueue
}

export const nowTime = () => {
  const dateTime = new Date()
  return `${dateTime.getFullYear}-${dateTime.getMonth}-${dateTime.getDay} ${dateTime.getHours}:${dateTime.getMinutes}`
}

export const sizeConvert = (fileSize: FileItem['fileSize']) => {
  return ((fileSize / 1024) < 1024)
    ? `${(fileSize / 1024).toFixed(2)} KB`
    : ((fileSize / 1024 / 1024) < 1024)
      ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
      : `${(fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export const pathConvert = (filePath: FileItem['filePath']) => (filePath.join('/') === '/') ? '/' : filePath.slice(1).join('/')

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

export const compressImage = (image: Cover): Promise<Cover> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(new Blob([new Uint8Array(image.data as ArrayBufferLike)], { type: image.format }))
    img.src = url
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0, img.width, img.height)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        blob?.arrayBuffer().then((buffer) => {
          resolve({
            ...image,
            format: 'image/webp',
            data: Buffer.from(new Uint8Array(buffer)),
            width: img.width,
            height: img.height,
          })
        })
      }, 'image/webp', 0.8)
    }
    img.onerror = (error) => {
      reject(error)
    }
  })
}

export const remoteItemToFile = (res: RemoteItem[]): FileItem[] => res.map((item) => ({
  fileName: item.name,
  filePath: ['/', ...item.parentReference.path.replace('/drive/root:', '').split('/').filter(item => item.length > 0).map(item => decodeURIComponent(item)), item.name],
  fileSize: item.size,
  fileType: (item.folder) ? 'folder' : checkFileType(item.name),
  lastModifiedDateTime: item.lastModifiedDateTime,
  id: item.id,
  thumbnails: item.thumbnails,
  url: item['@microsoft.graph.downloadUrl'],
}))

export const getNetMetaData = async (path: string[], url: string) => {
  console.log('Start get net metadata: ', path.slice(-1)[0])
  try {
    const metadata = await mm.fetchFromUrl(url)
    console.log('Get net metadata: ', metadata)
    if (metadata && metadata.common.title !== undefined) {
      const cover = !metadata.common.picture ? undefined : await Promise.all(metadata.common.picture.map(async (item: Cover) => await compressImage(item)))
      const lyrics = metadata.common.lyrics !== undefined && metadata.common.lyrics[0]
        || metadata.native['ID3v2.3'] && metadata.native['ID3v2.3'].find(item => item.id.toLocaleLowerCase().includes('lyrics'))?.value
        || null
      const metaData: MetaData = {
        path: path,
        title: metadata.common.title,
        artist: metadata.common.artist,
        albumArtist: metadata.common.albumartist,
        album: metadata.common.album,
        year: metadata.common.year,
        genre: metadata.common.genre,
        cover: cover,
        lyrics: lyrics,
      }
      return metaData
    }
  } catch (error) {
    console.log('Failed to get net metadata', error)
    return null
  }
}