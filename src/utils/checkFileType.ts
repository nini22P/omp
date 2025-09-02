import { FileType } from '@/types/file'

export const isAudio = (name: string) => (/.(wav|mp3|aac|ogg|flac|m4a|opus)$/i).test(name)
export const isVideo = (name: string) => (/.(mp4|mkv|avi|mov|rmvb|webm|flv)$/i).test(name)
export const isPicture = (name: string) => (/.(jpg|jpeg|png|bmp|webp|avif|tiff|gif|svg|ico)$/i.test(name))
export const isLyrics = (name: string) => (/.(lrc)$/i).test(name)
export const isSubtitle = (name: string) => (/.(ass|srt|ssa|vtt)$/i).test(name)

const checkFileType = (name: string): FileType => {
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

export default checkFileType