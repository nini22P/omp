import { useMsal } from '@azure/msal-react'
import { getAppRootFiles, getFile, getFiles, uploadAppRootJson } from '../graph'
import { loginRequest } from '../authConfig'

const useFilesData = () => {
  const { instance, accounts } = useMsal()

  /**
* 获取文件夹数据
* @param path 
* @returns
*/
  const getFilesData = async (path: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
    const response = await getFiles(path, acquireToken.accessToken)
    return response.value
  }

  /**
   * 获取文件数据
   * @param filePath 
   * @returns 
   */
  const getFileData = async (filePath: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
    const response = await getFile(filePath, acquireToken.accessToken)
    return response
  }

  const getAppRootFilesData = async (filePath: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
    const response = await getAppRootFiles(filePath, acquireToken.accessToken)
    return response
  }

  const uploadAppRootJsonData = async (fileName: string, fileContent: any) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
    const response = await uploadAppRootJson(fileName, fileContent, acquireToken.accessToken)
    return response
  }

  return { getFilesData, getFileData, getAppRootFilesData, uploadAppRootJsonData }
}

export default useFilesData
