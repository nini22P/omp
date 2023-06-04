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
  const accountId = 0
  const [folderTree, setFolderTree] = useState(['/'])
  const [fileList, setFileList] = useState([])
  const [playList, setPlayList] = useState<MediaItem[] | null>(null)

  const path = useMemo(
    () => {
      return (folderTree.join('/') === '/') ? '/' : folderTree.slice(1).join('/')
    },
    [folderTree]
  )

  useEffect(() => {
    if (accounts.length === 0) {
      setFileList([])
    } else {
      getFilesData(path).then(
        fileList => setFileList(fileList)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts.length, path])

  // 点击列表
  const handleListClick = (index: number, name: string, type: string) => {
    // 点击文件夹时打开列表
    if (type === 'folder') setFolderTree([...folderTree, name])
    // 点击文件时将媒体文件添加到播放列表
    if (type === 'file' && fileList !== null && name !== null) {
      console.log(index, name)
      const list = fileList
        .map((item: any) => {
          return {
            name: item.name,
            size: item.size,
            url: item['@microsoft.graph.downloadUrl']
          }
        })
      if (isAudio(name)) {
        setPlayList(list.filter(item => isAudio(item.name)))
      }
      if (isVideo(name)) {
        setPlayList(list.filter(item => isVideo(item.name)))
      }
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

  const isAudio = (name: string) => (/.(wav|mp3|aac|ogg|flac|m4a|opus)$/i).test(name)

  const isVideo = (name: string) => (/.(mp4|mkv|avi|mov|rmvb|webm|flv)$/i).test(name)

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