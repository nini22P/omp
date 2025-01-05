import { MetaData } from './MetaData'

export interface PlayerStatus {
  currentMetaData: MetaData | null,
  metadataUpdate: boolean,
  autoPlay: boolean,
  isLoading: boolean,
  cover: string,
  currentTime: number,
  duration: number,
}

export interface PlayerAction {
  updateCurrentMetaData: (currentMetaData: PlayerStatus['currentMetaData']) => void,
  updateMetadataUpdate: () => void,
  updateAutoPlay: (autoPlay: PlayerStatus['autoPlay']) => void,
  updateIsLoading: (isLoading: PlayerStatus['isLoading']) => void,
  updateCover: (cover: PlayerStatus['cover']) => void,
  updateCurrentTime: (currentTime: PlayerStatus['currentTime']) => void,
  updateDuration: (duration: PlayerStatus['duration']) => void,
  resetPlayer: () => void,
}