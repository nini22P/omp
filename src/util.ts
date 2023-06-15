import { playListItem } from './type'

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
const checkFileType = (name: string) => {
  if (isAudio(name))
    return 'audio'
  if (isVideo(name))
    return 'video'
  return 'other'
}

/**
 * 创建随机播放列表，当前播放id歌曲会排到第一
 * @param playList 播放列表
 * @param current 当前播放id
 * @returns 
 */
const shufflePlayList = (playList: playListItem[], current: number) => {
  const randomPlayList = [...playList]
  for (let i = randomPlayList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomPlayList[i], randomPlayList[j]] = [randomPlayList[j], randomPlayList[i]]
  }
  return randomPlayList.filter(item => item.index === current).concat(randomPlayList.filter(item => item.index !== current))
}

export { timeShift, checkFileType, shufflePlayList }