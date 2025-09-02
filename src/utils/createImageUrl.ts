import { IPicture } from 'music-metadata'

const createImageUrl = (image: IPicture[]): string => {
  if (image && image.length > 0) {
    const blob = new Blob([image[0].data as unknown as ArrayBuffer], { type: image[0].format })
    return URL.createObjectURL(blob)
  }
  return './cover.svg'
}

export default createImageUrl