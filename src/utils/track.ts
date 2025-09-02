import { FileNode, Track, RemoteItem } from '@/types/file'
import { getRemotePath } from './remote'

export const fileNodeToTrack = (fileNode: FileNode | Track): Track => {
  return {
    id: fileNode.id,
    name: fileNode.name,
    path: fileNode.path,
    size: fileNode.size,
    cTag: fileNode.cTag,
  }
}

export const remoteItemToTrack = (item: RemoteItem): Track => {
  return {
    id: item.id,
    name: item.name,
    path: getRemotePath(item),
    size: item.size,
    cTag: item.cTag,
  }
}