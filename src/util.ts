/**
 * 将时间转换为分钟
 * @param time 
 * @returns 
 */
const timeShift = (time: number) => {
  const minute = Number((time / 60).toFixed())
  const second = Number((time % 60).toFixed())
  return `${(minute < 10) ? '0' + minute : minute} : ${(second < 10) ? '0' + second : second}`
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