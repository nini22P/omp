import { useMemo, useState } from 'react'
import { Button, Container, Divider, Link, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import useSWR from 'swr'
import { loginRequest } from './authConfig'
import { getFile, getFiles } from './graph'
import NavBar from './components/NavBar'
import ListView from './components/ListView'
import Player from './components/Player/Player'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import SideBar from './components/SideBar'
import Grid from '@mui/material/Unstable_Grid2'
import MobileSideBar from './components/MobileSideBar'
import History from './components/History'

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
        <Router>
          <NavBar accounts={accounts} handleLogout={handleLogout} />
          <AuthenticatedTemplate>
            <div style={{ position: 'absolute', height: 'calc(100dvh - 6rem - 4rem)', width: '100%', top: '4rem', }}>
              <Container maxWidth="xl" disableGutters={true} sx={{ height: '100%' }}>
                <MobileSideBar />
                <Grid container flexDirection={'row'} height={'100%'}  >
                  <Grid xs={0} sm={4} md={4} lg={3} height={'100%'} sx={{ overflowY: 'auto', display: { xs: 'none', sm: 'block' }, }} pb={1} borderRight={`1px solid ${theme.palette.divider}`} >
                    <SideBar />
                    <Divider orientation="vertical" flexItem />
                  </Grid>
                  <Grid xs={12} sm={8} md={8} lg={9} height={'100%'} sx={{ overflowY: 'auto' }} pt={1} pb={3} pl={1} pr={1} >
                    <Routes>
                      <Route path='/' element={<ListView data={data} error={error} isLoading={isLoading} folderTree={folderTree} setFolderTree={setFolderTree} />} />
                      <Route path='/history' element={<History />} />
                      <Route path='*' element={<NotFound />} />
                    </Routes>
                  </Grid>
                </Grid>
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
        </Router>
      </ThemeProvider>
    </main >
  )
}

export default App