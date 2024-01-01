import { getAppRootFiles, getFile, getFileThumbnails, getFiles, uploadAppRootJson } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
import useUser from './useUser'
import { useMsal } from '@azure/msal-react'

const useFilesData = () => {
  const { account } = useUser()
  const { instance } = useMsal()

  /**
* 获取文件夹数据
* @param path 
* @returns
*/
  const getFilesData = async (path: string) => {
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
  const getFileData = async (filePath: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await getFile(filePath, acquireToken.accessToken)
    return response
  }

  /**
   * 获取文件缩略图
   * @param itemId 
   * @returns 
   */
  const getFileThumbnailsData = async (itemId: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await getFileThumbnails(itemId, acquireToken.accessToken)
    return response
  }

  const getAppRootFilesData = async (filePath: string) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
    const response = await getAppRootFiles(filePath, acquireToken.accessToken)
    return response
  }

  const uploadAppRootJsonData = async (fileName: string, fileContent: BodyInit) => {
    await instance.initialize()
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: account })
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
