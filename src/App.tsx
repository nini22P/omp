import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { loginRequest } from './authConfig'
import { getFile } from './graph'
import NavBar from './components/NavBar'
import ListView from './components/ListView'
import Player from './components/Player/Player'
import './App.scss'
import { Container } from '@mui/material'

const App = () => {
  const { instance, accounts } = useMsal()

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
          <ListView />
        </Container>
        <Player getFileData={getFileData} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <h5 >Please sign in to see your files.</h5>
      </UnauthenticatedTemplate>
    </main>
  )
}

export default App