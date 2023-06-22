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

  return fetch(`${graphConfig.graphMeEndpoint}/drive/root:/${encodeURI(path)}:/children?$top=2147483647`, options)
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

  return fetch(`${graphConfig.graphMeEndpoint}/drive/root:/${encodeURI(path)}`, options)
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

  return fetch(`${graphConfig.graphMeEndpoint}/drive/special/approot/${encodeURI(path)}/children`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}

export const uploadAppRootJson = async (fileName: string, fileContent: any, accessToken: string) => {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)
  headers.append('Content-Type', 'application/json')

  const options = {
    method: 'put',
    headers: headers,
    body: fileContent,
  }

  return fetch(`${graphConfig.graphMeEndpoint}/drive/special/approot:/${fileName}:/content`, options)
    .then(response => response.json())
    .catch(error => console.log(error))
}
