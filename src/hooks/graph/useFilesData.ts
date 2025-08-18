import { getAppRootFiles, getFile, getFiles, search, uploadAppRootJson, getDelta } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
import { useMsal } from '@azure/msal-react'
import { AccountInfo } from '@azure/msal-browser'
import useLocalDeltaDataStore, { deltaDataCache } from '@/store/useLocalDeltaDataStore'
import { RemoteItem } from '@/types/file'

const useFilesData = () => {
  const { instance } = useMsal()
  const { setLocalDeltaData, getLocalDeltaData } = useLocalDeltaDataStore()

  /**
* 获取文件夹数据
* @param path 
* @returns
*/
  const getFilesData = async (account: AccountInfo, path: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await getFiles(path, acquireToken.accessToken)
    return response.value
  }

  /**
   * 获取文件数据
   * @param filePath 
   * @returns 
   */
  const getFileData = async (account: AccountInfo, filePath: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await getFile(filePath, acquireToken.accessToken)
    return response
  }

  const getAppRootFilesData = async (account: AccountInfo, filePath: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await getAppRootFiles(filePath, acquireToken.accessToken)
    return response
  }

  const uploadAppRootJsonData = async (account: AccountInfo, fileName: string, fileContent: BodyInit) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await uploadAppRootJson(fileName, fileContent, acquireToken.accessToken)
    return response
  }

  const getSearchData = async (account: AccountInfo, path: string, searchQuery: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await search(path, searchQuery, acquireToken.accessToken)
    return response.value
  }

  const getRemoteDeltaData = async (account: AccountInfo, path: string, url?: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    let response = await getDelta(path, acquireToken.accessToken, url)
    const result:RemoteItem[] = response.value
    while (response['@odata.nextLink']) {
      const nextResponse = await getDelta(path, acquireToken.accessToken, response['@odata.nextLink'])
      result.push(...nextResponse.value)
      response = nextResponse
    }
    const deltaData: deltaDataCache = {items: result, url: response['@odata.deltaLink']}
    return deltaData
  }
  
  const getDeltaData = async(account: AccountInfo, path: string) => {
    const localData = await getLocalDeltaData(path)
    if (localData && localData.url) {
      try {
        const response = await getRemoteDeltaData(account, path, localData.url)
        const result = localData.items
        response.items.forEach((item: RemoteItem) => {
          const index = result.findIndex(i => i.id === item.id)
          if (item.deleted) {
            if (index !== -1) result.splice(index, 1)
          } else {
            if (index === -1) result.push(item)
          }
        })
        setLocalDeltaData(path, {items: result, url: response.url})
        return result
      } catch (error) {
        console.error('Get delta data error:', error)
      }
    }
    const response = await getRemoteDeltaData(account, path)
    setLocalDeltaData(path, response)
    return response.items
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

export default useFilesData
