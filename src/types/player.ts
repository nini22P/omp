import { MetaData } from './MetaData'

export interface PlayerStatus {
  currentMetaData: MetaData | null;
  metadataUpdate: boolean;
  playStatu: 'paused' | 'playing';
  isLoading: boolean;
  cover: string;
  currentTime: number;
  duration: number;
}

export interface PlayerAction {
  updateCurrentMetaData: (currentMetaData: PlayerStatus['currentMetaData']) => void;
  updateMetadataUpdate: () => void;
  updatePlayStatu: (isPlaying: PlayerStatus['playStatu']) => void;
  updateIsLoading: (isLoading: PlayerStatus['isLoading']) => void;
  updateCover: (cover: PlayerStatus['cover']) => void;
  updateCurrentTime: (currentTime: PlayerStatus['currentTime']) => void;
  updateDuration: (duration: PlayerStatus['duration']) => void;
}