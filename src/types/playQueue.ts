import { FileItem } from './file'

export interface PlayQueueItem extends FileItem {
  index: number
}

export interface PlayQueueState {
  playQueue: PlayQueueItem[] | null
  currentIndex: number
}

export interface PlayQueueActions {
  updatePlayQueue: (PlayQueue: PlayQueueState['playQueue']) => void
  updateCurrentIndex: (index: PlayQueueState['currentIndex']) => void
  resetPlayQueue: () => void
}