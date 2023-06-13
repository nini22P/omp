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

export { timeShift, checkFileType }