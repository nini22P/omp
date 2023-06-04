import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { loginRequest } from "./authConfig"
import { getFiles } from './graph'
import SignInButton from './components/List/SignInButton'
import Navbar from './components/Navbar/Navbar'
import { useEffect, useMemo, useState } from 'react'
import './App.scss'
import ListView from './components/List/ListView'
import Player from './components/Player/Player'
import { MediaItem } from './type'

const App = () => {
  const { instance, accounts } = useMsal()
  const [accountId, setAccountId] = useState(0)
  const [folderTree, setFolderTree] = useState(['/'])
  const [fileList, setFileList] = useState(null)
  const [playList, setPlayList] = useState<MediaItem[] | null>(null)

  const path = useMemo(
    () => {
      return (folderTree.join('/') === '/') ? '/' : folderTree.slice(1).join('/')
    },
    [folderTree]
  )

  useEffect(() => {
    if (accounts.length === 0) {
      setFileList(null)
    } else {
      getFilesData(path).then(
        fileList => setFileList(fileList)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts.length, path])

  // 点击列表
  const handleListClick = (index: number, name: string, type: string) => {
    if (type === 'folder') setFolderTree([...folderTree, name])
    if (type === 'file' && fileList !== null) {
      console.log(index, name)
    }
  }

  const handleListNavClick = (index: number) => {
    console.log(index, folderTree.slice(0, index + 1))
    setFolderTree(folderTree.slice(0, index + 1))
  }

  const getFilesData = async (path: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[accountId] })
    const response = await getFiles(path, acquireToken.accessToken)
    return response.value
  }

  return (
    <main className='main'>
      <Navbar accounts={accounts} />
      <div className='container'>
        <AuthenticatedTemplate>
          <ListView
            folderTree={folderTree}
            fileList={fileList}
            handleListClick={handleListClick}
            handleListNavClick={handleListNavClick} />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div className='center'>
            <h5 >Please sign-in to see your files.</h5>
            <SignInButton />
          </div>
        </UnauthenticatedTemplate>
      </div>
      <Player playList={playList} />
    </main>
  )
}

export default App