import { FileNode, Track } from '@/types/file'
import { MetaData } from '@/types/metaData'
import { IPicture, parseWebStream } from 'music-metadata'

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

const getNetMetaData = async (file: FileNode | Track, url: string): Promise<MetaData | null> => {
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

export default getNetMetaData
