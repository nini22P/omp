import { getAppRootFiles, getFile, getFiles, uploadAppRootJson } from '../services/graph'
import { loginRequest } from '../services/authConfig'
import useUser from './useUser'

const useFilesData = () => {
  const { instance, accounts } = useUser()

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

  const uploadAppRootJsonData = async (fileName: string, fileContent: BodyInit) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
    const response = await uploadAppRootJson(fileName, fileContent, acquireToken.accessToken)
    return response
  }

  return { getFilesData, getFileData, getAppRootFilesData, uploadAppRootJsonData }
}

export default useFilesData
