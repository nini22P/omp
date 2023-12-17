export interface File {
  fileName: string;
  filePath: string[];
  fileSize: number;
  fileType: 'folder' | 'audio' | 'video' | 'picture' | 'other';
  lastModifiedDateTime?: string;
  id: string;
}

export interface Thumbnail {
  height: number;
  width: number;
  url: string;
}

export interface Thumbnails {
  id: string;
  small: Thumbnail;
  medium: Thumbnail;
  large: Thumbnail;
}