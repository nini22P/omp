import { graphConfig } from './authConfig'

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken 
 */
export async function callMsGraph(accessToken: string) {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  return fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

/**
 * 根据文件夹路径获取文件列表
 * @param path 
 * @param accessToken 
 * @returns 
 */
export async function getFiles(path: string, accessToken: string) {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  return fetch(`${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(path)}:/children?$top=2147483647&expand=thumbnails`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

/**
 * 根据文件路径获取文件信息
 * @param path 
 * @param accessToken 
 * @returns 
 */
export async function getFile(path: string, accessToken: string) {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  return fetch(`${graphConfig.graphMeEndpoint}/me/drive/root:/${encodeURIComponent(path)}`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

/**
 * 根据文件id获取缩略图
 * @param path 
 * @param accessToken 
 * @returns 
 */
export async function getFileThumbnails(itemId: string, accessToken: string) {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  return fetch(`${graphConfig.graphMeEndpoint}/me/drive/items/${itemId}/thumbnails`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const getAppRootFiles = async (path: string, accessToken: string) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)

  const options = {
    method: 'GET',
    headers: headers
  }

  return fetch(`${graphConfig.graphMeEndpoint}/me/drive/special/approot/${encodeURIComponent(path)}/children`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const uploadAppRootJson = async (fileName: string, fileContent: BodyInit, accessToken: string) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)
  headers.append('Content-Type', 'application/json')

  const options = {
    method: 'put',
    headers: headers,
    body: fileContent,
  }

  return fetch(`${graphConfig.graphMeEndpoint}/me/drive/special/approot:/${fileName}:/content`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}
