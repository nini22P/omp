import { DeltaResponse, FileResponse, RemoteItem } from '@/types/file'
import { graphConfig } from './authConfig'
import { graphFetch, GraphRequestPriority } from './rateLimiter'

export async function getFiles(
  accessToken: string,
  id: string,
  path?: string[],
  nextLink?: string,
  priority?: GraphRequestPriority,
): Promise<FileResponse> {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const queryParams = {
    $top: '2147483647',
    $expand: 'thumbnails'
  }

  const params = new URLSearchParams(queryParams)

  const url = path
    ? path.length === 0
      ? `${graphConfig.graphMeEndpoint}/me/drive/root/children?${params.toString()}`
      : `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(path.join('/'))}:/children?${params.toString()}`
    : `${graphConfig.graphMeEndpoint}/me/drive/items/${id}/children?${params.toString()}`

  return graphFetch(nextLink || url, options, { priority })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const parseGraphResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Graph request failed with status ${response.status}.`)
  }

  return response.json() as Promise<T>
}

const requestDriveItem = async (
  accessToken: string,
  id: string,
  path?: string[],
  signal?: AbortSignal,
  priority?: GraphRequestPriority,
  includeThumbnails = false,
): Promise<RemoteItem> => {
  const headers = new Headers({ Authorization: `Bearer ${accessToken}` })
  const query = includeThumbnails
    ? `?${new URLSearchParams({ $expand: 'thumbnails' }).toString()}`
    : ''

  const url = path
    ? `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(path.join('/'))}${query}`
    : `${graphConfig.graphMeEndpoint}/me/drive/items/${id}${query}`
  const response = await graphFetch(url, { method: 'GET', headers, signal }, { priority })

  return parseGraphResponse<RemoteItem>(response)
}

export async function getFile(
  accessToken: string,
  id: string,
  path?: string[],
  signal?: AbortSignal,
  priority?: GraphRequestPriority,
  includeThumbnails = true,
): Promise<RemoteItem> {
  return requestDriveItem(accessToken, id, path, signal, priority, includeThumbnails)
}

export const getAppRootFiles = async (
  accessToken: string,
  priority?: GraphRequestPriority,
) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const url = `${graphConfig.graphMeEndpoint}/me/drive/special/approot/children`

  return graphFetch(url, options, { priority })
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const uploadAppRootJson = async (
  accessToken: string,
  fileName: string,
  fileContent: BodyInit,
  priority?: GraphRequestPriority,
) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)
  headers.append('Content-Type', 'application/json')

  const options = {
    method: 'put',
    headers: headers,
    body: fileContent,
  }

  const url = `${graphConfig.graphMeEndpoint}/me/drive/special/approot:/${fileName}:/content`

  return graphFetch(url, options, { priority })
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const search = async (
  accessToken: string,
  searchQuery: string,
  priority?: GraphRequestPriority,
): Promise<FileResponse> => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const url = `${graphConfig.graphMeEndpoint}/me/drive/root/search(q='${searchQuery}')`

  return graphFetch(url, options, { priority })
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const getDelta = async (
  accessToken: string,
  id?: string,
  deltaLink?: string,
  priority?: GraphRequestPriority,
): Promise<DeltaResponse> => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const queryParams = {
    $top: '2147483647',
    // 目前 /delta 接口不会返回 audio 字段
    $select: 'id,name,parentReference,folder,cTag,deleted,size,lastModifiedDateTime'
  }

  const param = new URLSearchParams(queryParams)

  const url = id
    ? `${graphConfig.graphMeEndpoint}/me/drive/items/${id}/delta?${param.toString()}`
    : `${graphConfig.graphMeEndpoint}/me/drive/root/delta?${param.toString()}`

  return graphFetch(deltaLink || url, options, { priority })
    .then(response => response.json())
    .catch(error => console.log(error))
}
