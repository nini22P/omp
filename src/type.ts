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

export type { FileItem, MediaItem, PlayList, PLayerStatus }