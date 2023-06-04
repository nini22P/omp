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
  url: string;
}

export type { FileItem, MediaItem }