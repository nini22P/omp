import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { loginRequest } from './authConfig'
import { getFile, getFiles } from './graph'
import NavBar from './components/NavBar'
import ListView from './components/ListView'
import Player from './components/Player/Player'
import './App.scss'
import { Button, Container } from '@mui/material'
import useSWR from 'swr'
import { useState } from 'react'

const App = () => {
  const { instance, accounts } = useMsal()
  const [folderTree, setFolderTree] = useState(['Home'])

  const fileListFetcher = (path: string) => getFilesData(path).then((res: any) => res)
  const { data, error, isLoading } = useSWR<any, Error, any>((folderTree.join('/') === 'Home') ? '/' : folderTree.slice(1).join('/'), fileListFetcher, { revalidateOnFocus: false })


  // 登入
  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .catch(e => {
        console.log(e)
      })
  }

  //登出
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/"
    })
  }

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
      <NavBar accounts={accounts} handleLogout={handleLogout} />
      <AuthenticatedTemplate>
        <Container maxWidth="xl" sx={{ pb: 18 }} >
          <ListView data={data} error={error} isLoading={isLoading} folderTree={folderTree} setFolderTree={setFolderTree} />
        </Container>
        <Player getFileData={getFileData} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
          <h4 >Please sign in to see your files.</h4>
          <Button size="large" onClick={() => handleLogin()}>Sign in</Button>
        </div>
      </UnauthenticatedTemplate>
    </main>
  )
}

export default App