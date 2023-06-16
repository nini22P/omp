import { useMemo, useState } from 'react'
import { Button, Container, Link, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import useSWR from 'swr'
import { loginRequest } from './authConfig'
import { getFile, getFiles } from './graph'
import NavBar from './components/NavBar'
import ListView from './components/ListView'
import Player from './components/Player/Player'

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#8e24aa',
          },
          secondary: {
            main: '#ff3d00',
          },
          error: {
            main: '#ff1744',
          },
        },
      }),
    [prefersDarkMode],
  )

  const { instance, accounts } = useMsal()
  const [folderTree, setFolderTree] = useState(['Home'])

  const fileListFetcher = (path: string) => getFilesData(path).then((res) => res)
  const { data, error, isLoading } = useSWR((folderTree.join('/') === 'Home') ? '/' : folderTree.slice(1).join('/'), fileListFetcher, { revalidateOnFocus: false })

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
      postLogoutRedirectUri: '/'
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
    <main>
      <ThemeProvider theme={theme}>
        <NavBar accounts={accounts} handleLogout={handleLogout} />
        <AuthenticatedTemplate>
          <div style={{ position: 'absolute', height: 'calc(100dvh - 6rem - 3rem)', width: '100%', top: '3rem', overflowY: 'auto' }}>
            <Container maxWidth="xl" sx={{ pb: 3 }} >
              <ListView data={data} error={error} isLoading={isLoading} folderTree={folderTree} setFolderTree={setFolderTree} />
            </Container>
          </div>
          <Player getFileData={getFileData} />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Container
            style={{
              height: 'calc(100dvh)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              textAlign: 'center',
            }}>
            <div>
            </div>
            <div>
              <Typography variant="h5" pb={2} >
                Please sign in to see your files
              </Typography>
              <Button size="large" onClick={() => handleLogin()}>Sign in</Button>
            </div>
            <footer>
              Made with ❤ from <Link underline='none' href='https://github.com/nini22P'>22</Link>
            </footer>
          </Container>
        </UnauthenticatedTemplate>
      </ThemeProvider>
    </main>
  )
}

export default App