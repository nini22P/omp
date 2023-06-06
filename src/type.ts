interface FileItem {
  index: number;
  name: string;
  size: number;
  type: 'folder' | 'file';
  handleListClick: (index: number, name: string, type: 'folder' | 'file') => void;
}

interface MediaItem {
  name: string;
  size: number;
  path: string;
}

interface PlayList {
  playList: MediaItem[] | null
}

interface PLayerStatus {
  type: 'audio' | 'video' | null;
  playList: MediaItem[] | null;
  index: number;
  total: number;
  url: string;
  playing: boolean;
  loop: boolean;
  light: boolean | string;
  muted: boolean;
  progress: number;
  duration: number;
  containerIsHiding: boolean;
}

interface Action {
  updatePlayList: (playList: PLayerStatus['playList']) => void;
  updateIndex: (index: PLayerStatus['index']) => void;
  updateTotal: (total: PLayerStatus['total']) => void;
  updateUrl: (url: PLayerStatus['url']) => void;
  updatePlaying: (playing: PLayerStatus['playing']) => void;
  updateLoop: (playing: PLayerStatus['loop']) => void;
}

export type { FileItem, MediaItem, PlayList, PLayerStatus, Action }