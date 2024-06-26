export interface RemoteItem {
  name: string,
  size: number,
  lastModifiedDateTime: string,
  id: string,
  thumbnails: Thumbnail[],
  '@microsoft.graph.downloadUrl'?: string,
  folder?: object,
  parentReference: {
    name: string,
    path: string,
  }
}

export interface FileItem {
  fileName: string,
  filePath: string[],
  fileSize: number,
  fileType: 'folder' | 'audio' | 'video' | 'picture' | 'other',
  lastModifiedDateTime?: string,
  id?: string,
  thumbnails?: Thumbnail[],
  url?: string,
}

export interface ThumbnailItem {
  height: number,
  width: number,
  url: string,
}

export interface Thumbnail {
  id: string,
  small: ThumbnailItem,
  medium: ThumbnailItem,
  large: ThumbnailItem,
}