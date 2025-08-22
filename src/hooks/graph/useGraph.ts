import { getAppRootFiles, getFile, getFiles, search, uploadAppRootJson, getDelta } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser'

const useGraph = (
  instance: IPublicClientApplication,
  account: AccountInfo | null | undefined,
) => {

  const getAccessToken = async (): Promise<string> => {
    if (!account) {
      throw new Error('User account is not available. Please log in.')
    }

    await instance.initialize()
    const tokenResponse = await instance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    })
    return tokenResponse.accessToken
  }

  const getFilesData = async (id: string, path?: string[]) => {
    const accessToken = await getAccessToken()

    let response = await getFiles(accessToken, id, path,)

    const remoteItems = [...response.value]

    while (response['@odata.nextLink']) {
      response = await getFiles(accessToken, id, path, response['@odata.nextLink'])
      remoteItems.push(...response.value)
    }

    return { value: remoteItems }
  }

  const getFileData = async (id: string, path?: string[],) => {
    const accessToken = await getAccessToken()
    const response = await getFile(accessToken, id, path)
    return response
  }

  const getAppRootFilesData = async () => {
    const accessToken = await getAccessToken()
    const response = await getAppRootFiles(accessToken)
    return response
  }

  const uploadAppRootJsonData = async (fileName: string, fileContent: BodyInit) => {
    const accessToken = await getAccessToken()
    const response = await uploadAppRootJson(accessToken, fileName, fileContent)
    return response
  }

  const getSearchData = async (searchQuery: string) => {
    const accessToken = await getAccessToken()
    const response = await search(accessToken, searchQuery)
    return response
  }

  const getDeltaData = async (id: string, deltaLink?: string) => {
    const accessToken = await getAccessToken()

    let response = await getDelta(accessToken, id, deltaLink)

    const remoteItems = [...response.value]

    while (response['@odata.nextLink']) {
      response = await getDelta(accessToken, id, response['@odata.nextLink'])
      remoteItems.push(...response.value)
    }

    if (!response['@odata.deltaLink']) {
      throw new Error('Delta sync failed: No new deltaLink received.')
    }

    return {
      '@odata.deltaLink': response['@odata.deltaLink'],
      value: remoteItems,
    }
  }


  return {
    getFilesData,
    getFileData,
    getAppRootFilesData,
    uploadAppRootJsonData,
    getSearchData,
    getDeltaData,
  }
}

export default useGraph
