import { getAppRootFiles, getFile, getFileThumbnails, getFiles, uploadAppRootJson } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
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

  /**
   * 获取文件缩略图
   * @param itemId 
   * @returns 
   */
  const getFileThumbnailsData = async (itemId: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] })
    const response = await getFileThumbnails(itemId, acquireToken.accessToken)
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

  return {
    getFilesData,
    getFileData,
    getFileThumbnailsData,
    getAppRootFilesData,
    uploadAppRootJsonData,
  }
}

export default useFilesData
