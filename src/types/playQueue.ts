import { File } from './file'

export interface PlayQueueItem extends File {
  index: number;
}

export interface PlayQueueStatus {
  playQueue: PlayQueueItem[] | null;
  currentIndex: number;
}

export interface PlayQueueAction {
  updatePlayQueue: (PlayQueue: PlayQueueStatus['playQueue']) => void;
  updateCurrentIndex: (index: PlayQueueStatus['currentIndex']) => void;
  resetPlayQueue: () => void;
}