import { FileItem, PlayQueueItem } from './type'

/**
 * 将时间转换为分钟
 * @param time 
 * @returns 
 */
const timeShift = (time: number) => {
  const minute = Math.floor(time / 60).toFixed().toString().padStart(2, '0')
  const second = (time % 60).toFixed().toString().padStart(2, '0')
  return `${minute} : ${second}`
}

const isAudio = (name: string) => (/.(wav|mp3|aac|ogg|flac|m4a|opus)$/i).test(name)
const isVideo = (name: string) => (/.(mp4|mkv|avi|mov|rmvb|webm|flv)$/i).test(name)
const checkFileType = (name: string): FileItem['fileType'] => {
  if (isAudio(name))
    return 'audio'
  if (isVideo(name))
    return 'video'
  return 'other'
}

/**
 * 创建随机播放队列，当前播放id歌曲会排到第一
 * @param playQueue 播放队列
 * @param current 当前播放id
 * @returns 
 */
const shufflePlayQueue = (playQueue: PlayQueueItem[], current: number) => {
  const randomPlayQueue = [...playQueue]
  for (let i = randomPlayQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomPlayQueue[i], randomPlayQueue[j]] = [randomPlayQueue[j], randomPlayQueue[i]]
  }
  return randomPlayQueue.filter(item => item.index === current).concat(randomPlayQueue.filter(item => item.index !== current))
}

const nowTime = () => {
  const dateTime = new Date()
  return `${dateTime.getFullYear}-${dateTime.getMonth}-${dateTime.getDay} ${dateTime.getHours}:${dateTime.getMinutes}`
}

const fileSizeConvert = (fileSize: number) => {
  return ((fileSize / 1024) < 1024)
    ? `${(fileSize / 1024).toFixed(2)} KB`
    : ((fileSize / 1024 / 1024) < 1024)
      ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
      : `${(fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export { timeShift, checkFileType, shufflePlayQueue, nowTime, fileSizeConvert }