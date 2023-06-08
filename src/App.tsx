import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { loginRequest } from './authConfig'
import { getFile, getFiles } from './graph'
import NavBar from './components/NavBar'
import ListView from './components/ListView'
import Player from './components/Player/Player'
import './App.scss'
import { Container, Paper } from '@mui/material'
import useSWR from 'swr'
import { useState } from 'react'

const App = () => {
  const { instance, accounts } = useMsal()
  const [folderTree, setFolderTree] = useState(['Home'])

  const fileListFetcher = (path: string) => getFilesData(path).then((res: any) => res)
  const { data, error, isLoading } = useSWR<any, Error, any>((folderTree.join('/') === 'Home') ? '/' : folderTree.slice(1).join('/'), fileListFetcher, { revalidateOnFocus: false })

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

  return (
    <main className='main'>
      <NavBar />
      <AuthenticatedTemplate>
        <Container maxWidth="xl" sx={{ pb: 18 }} >
          <ListView data={data} error={error} isLoading={isLoading} folderTree={folderTree} setFolderTree={setFolderTree} />
        </Container>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
          <Player getFileData={getFileData} />
        </Paper>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h5 >Please sign in to see your files.</h5>
      </UnauthenticatedTemplate>
    </main>
  )
}

export default App