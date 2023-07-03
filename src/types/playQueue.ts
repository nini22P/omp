import { File } from './file'

export interface PlayQueueItem extends File {
  index: number;
}

export interface PlayQueueStatus {
  type: 'audio' | 'video';
  playQueue: PlayQueueItem[] | null;
  currentIndex: number;
}

export interface PlayQueueAction {
  updateType: (type: PlayQueueStatus['type']) => void,
  updatePlayQueue: (PlayQueue: PlayQueueStatus['playQueue']) => void;
  updateCurrentIndex: (index: PlayQueueStatus['currentIndex']) => void;
  removeFilesFromPlayQueue: (filePathArray: File['filePath'][]) => void;
}