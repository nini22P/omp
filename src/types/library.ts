import { FileType } from './file'

export interface Settings {
  id: 'settings'
  deltaLink?: string
  libraryRootId?: string
}

export interface FileNode {
  id: string
  parentId?: string
  name: string
  type: FileType
  cTag?: string
  size: number
  lastModifiedDateTime: string
  metadataState: 'pending' | 'completed' | 'failed'
}