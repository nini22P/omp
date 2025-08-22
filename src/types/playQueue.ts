import { PlaylistItem } from './file'

export interface PlayQueueItem extends PlaylistItem {
  index: number
}

export interface PlayQueueState {
  playQueue: PlayQueueItem[]
  currentIndex: number
}

export interface PlayQueueActions {
  updatePlayQueue: (PlayQueue: PlayQueueState['playQueue']) => void
  updateCurrentIndex: (index: PlayQueueState['currentIndex']) => void
  resetPlayQueue: () => void
}