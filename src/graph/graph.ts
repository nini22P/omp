import { DeltaResponse, FileResponse, RemoteItem } from '@/types/file'
import { graphConfig } from './authConfig'

export async function getFiles(
  accessToken: string,
  id: string,
  path?: string[],
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

  const url = path
    ? path.length === 0
      ? `${graphConfig.graphMeEndpoint}/me/drive/root/children?${params.toString()}`
      : `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(path.join('/'))}:/children?${params.toString()}`
    : `${graphConfig.graphMeEndpoint}/me/drive/items/${id}/children?${params.toString()}`

  return fetch(nextLink || url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export async function getFile(
  accessToken: string,
  id: string,
  path?: string[],
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

  const url = path
    ? `${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(path.join('/'))}?${params.toString()}`
    : `${graphConfig.graphMeEndpoint}/me/drive/items/${id}?${params.toString()}`

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const getAppRootFiles = async (
  accessToken: string,
) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  const url = `${graphConfig.graphMeEndpoint}/me/drive/special/approot/children`

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const uploadAppRootJson = async (
  accessToken: string,
  fileName: string,
  fileContent: BodyInit,
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
  accessToken: string,
  searchQuery: string,
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
  accessToken: string,
  id?: string,
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
    $select: 'id,name,parentReference,folder,cTag,deleted,size,lastModifiedDateTime,audio'
  }

  const param = new URLSearchParams(queryParams)

  const url = id
    ? `${graphConfig.graphMeEndpoint}/me/drive/items/${id}/delta?${param.toString()}`
    : `${graphConfig.graphMeEndpoint}/me/drive/root/delta?${param.toString()}`

  return fetch(deltaLink || url, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}