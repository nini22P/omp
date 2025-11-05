import { IAudioMetadata, ICommonTagsResult, IPicture } from 'music-metadata'

export interface Picture extends Omit<IPicture, 'data'> {
  sha256: string
}

export interface PicutreData {
  id: string
  data: Uint8Array
}

export interface MetaData {
  id: string
  common: Omit<ICommonTagsResult, 'picture'> & {
    albumartists?: string[]
    picture?: Picture[]
  };
  format: IAudioMetadata['format']
}