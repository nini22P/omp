import { DeltaResponse, FileResponse, RemoteItem } from '@/types/file'
import { graphConfig } from './authConfig'
import { pathConv } from '@/utils'

/**
 * 根据文件夹路径获取文件列表
 * @param path 
 * @param accessToken 
 * @returns 
 */
export async function getFiles(
  path: string[],
  accessToken: string,
  nextLink?: string,
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

  const url = `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(pathConv(path))}:/children?${params.toString()}`

  return fetch(nextLink || url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

/**
 * 根据文件路径获取文件信息
 * @param path 
 * @param accessToken 
 * @returns 
 */
export async function getFile(
  path: string[],
  accessToken: string,
): Promise<RemoteItem> {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const queryParams = {
    $expand: 'thumbnails'
  }

  const params = new URLSearchParams(queryParams)

  const url = `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(pathConv(path))}?${params.toString()}`

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const getAppRootFiles = async (
  path: string[],
  accessToken: string,
) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const url = `${graphConfig.graphMeEndpoint}/me/drive/special/approot:/${encodeURIComponent(pathConv(path))}:/children`

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const uploadAppRootJson = async (
  fileName: string,
  fileContent: BodyInit,
  accessToken: string,
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

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const search = async (
  searchQuery: string,
  accessToken: string,
): Promise<FileResponse> => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const url = `${graphConfig.graphMeEndpoint}/me/drive/root/search(q='${searchQuery}')`

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const getDelta = async (
  path: string[],
  accessToken: string,
  deltaLink?: string,
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
    $select: 'name, parentReference, size, folder, lastModifiedDateTime, id, @microsoft.graph.downloadUrl'
  }

  const param = new URLSearchParams(queryParams)

  const url = `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(pathConv(path))}:/delta?${param.toString()}`

  return fetch(deltaLink || url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}