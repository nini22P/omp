import { RemoteItem, FileNode } from '@/types/file'
import checkFileType from './checkFileType'
import { rateLimitedFetch } from '@/graph/rateLimiter'

/**
 * 根据 url 解析 json
 * @param url 
 * @returns 
 */
export const fetchJson = async (url: string) => {
  try {
    const response = await rateLimitedFetch(url, undefined, {
      scope: 'External',
      retryNetworkErrors: true,
    })
    const json = response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}

export const remoteItemToFileNode = (
  item: RemoteItem,
  options?: { includeVisuals?: boolean }
): FileNode => {
  const baseNode: FileNode = {
    id: item.id,
    parentId: item.parentReference.id,
    name: item.name,
    path: getRemotePath(item),
    type: checkFileType(item.name),
    size: item.size,
    lastModifiedDateTime: item.lastModifiedDateTime,
    metadataState: checkFileType(item.name) === 'audio' ? 'pending' : 'completed',
    cTag: item.cTag,
    folder: item.folder ? 1 : 0,
    childCount: item.folder?.childCount,
  }

  if (options?.includeVisuals) {
    baseNode.thumbnails = item.thumbnails
    baseNode.url = item['@microsoft.graph.downloadUrl']
  }

  return baseNode
}


export const getRemotePath = (item: RemoteItem) => item.parentReference.path
  ? [
    ...item.parentReference.path
      .replace('/drive/root:', '')
      .split('/')
      .filter(item => item.length > 0)
      .map(item => decodeURIComponent(item)),
    item.name,
  ]
  : []

export const sizeConv = (fileSize: number) => {
  return ((fileSize / 1024) < 1024)
    ? `${(fileSize / 1024).toFixed(2)} KB`
    : ((fileSize / 1024 / 1024) < 1024)
      ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
      : `${(fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`
}
