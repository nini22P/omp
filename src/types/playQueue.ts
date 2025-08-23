import { Track } from './file'

export interface QueuedTrack {
  track: Track
  index: number
}

export interface PlayQueueState {
  playQueue: QueuedTrack[]
  currentIndex: number
}

export interface PlayQueueActions {
  updatePlayQueue: (PlayQueue: PlayQueueState['playQueue']) => void
  updateCurrentIndex: (index: PlayQueueState['currentIndex']) => void
  resetPlayQueue: () => void
}