import { MetaData } from './metaData'

export interface PlayerState {
  currentMetaData: MetaData | null
  metadataUpdate: boolean
  autoPlay: boolean
  isLoading: boolean
  cover: string
  currentTime: number
  duration: number
}

export interface PlayerActions {
  updateCurrentMetaData: (currentMetaData: PlayerState['currentMetaData']) => void
  updateMetadataUpdate: () => void
  updateAutoPlay: (autoPlay: PlayerState['autoPlay']) => void
  updateIsLoading: (isLoading: PlayerState['isLoading']) => void
  updateCover: (cover: PlayerState['cover']) => void
  updateCurrentTime: (currentTime: PlayerState['currentTime']) => void
  updateDuration: (duration: PlayerState['duration']) => void
  resetPlayer: () => void
}