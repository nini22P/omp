export interface FileResponse {
  '@odata.nextLink'?: string
  value: RemoteItem[]
}

export interface DeltaResponse {
  '@odata.deltaLink'?: string
  '@odata.nextLink'?: string
  value: RemoteItem[]
}

export interface FileDetails {
  mimeType: string
  hashes?: {
    quickXorHash?: string
    sha1Hash?: string
    sha256Hash?: string
    crc32Hash?: string
  }
}

export interface FolderDetails {
  childCount: number
  view?: {
    sortBy: string
    sortOrder: 'ascending' | 'descending'
    viewType: 'details' | 'thumbnails' | 'list' | 'icons'
  }
}

export interface ParentReference {
  driveId: string
  driveType: string
  id?: string
  name?: string
  path?: string
}

export interface ThumbnailItem {
  height: number
  width: number
  url: string
}

export interface Thumbnail {
  id: string
  small: ThumbnailItem
  medium: ThumbnailItem
  large: ThumbnailItem
}

export interface IdentitySet {
  user?: {
    id: string
    displayName: string
    email?: string
  }
}

export interface DeletedState {
  state: 'deleted'
}

export interface RemoteItem {
  id: string
  name: string
  size: number
  webUrl: string
  createdDateTime: string
  lastModifiedDateTime: string

  cTag?: string
  eTag?: string

  file?: FileDetails
  folder?: FolderDetails

  parentReference: ParentReference

  thumbnails?: Thumbnail[]
  '@microsoft.graph.downloadUrl'?: string

  createdBy?: IdentitySet
  lastModifiedBy?: IdentitySet

  deleted?: DeletedState
}

export type FileType = 'audio' | 'video' | 'picture' | 'lyrics' | 'subtitle' | 'other'

export interface FileItem {
  fileName: string
  filePath: string[]
  fileSize: number
  fileType: FileType
}

export interface FileNode {
  id: string
  parentId?: string
  name: string
  path: string[]
  type: FileType
  size: number
  lastModifiedDateTime: string
  metadataState?: 'pending' | 'completed' | 'failed'
  cTag?: string
  folder?: number
  childCount?: number
  thumbnails?: Thumbnail[]
  url?: string
}

export interface Track {
  id: string
  name: string
  path: string[]
  size: number
  cTag?: string
}