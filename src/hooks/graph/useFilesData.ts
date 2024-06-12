import { getAppRootFiles, getFile, getFiles, uploadAppRootJson } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
import { useMsal } from '@azure/msal-react'
import { AccountInfo } from '@azure/msal-browser'

const useFilesData = () => {
  const { instance } = useMsal()

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

  return {
    getFilesData,
    getFileData,
    getAppRootFilesData,
    uploadAppRootJsonData,
  }
}

export default useFilesData
