import { IPicture } from 'music-metadata-browser'

export interface Cover extends IPicture {
  width?: number
  height?: number
}

export interface LocalStorageCover extends Omit<Cover, 'data'> {
  data: { type: 'Buffer', data: number[] }
}

export interface MetaData {
  path: string[]
  size?: number
  title: string
  artist?: string
  albumArtist?: string
  album?: string
  year?: number
  genre?: string[]
  cover?: Cover[] | LocalStorageCover[]
  lyrics?: string
}