import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { loginRequest } from './authConfig'
import { getFile, getFiles } from './graph'
import { useMemo, useState } from 'react'
import useSWR from "swr"
import SignInButton from './components/List/SignInButton'
import Navbar from './components/Navbar/Navbar'
import ListView from './components/List/ListView'
import Player from './components/Player/Player'
import usePlayerStore from './store'
import './App.scss'

const App = () => {
  const { instance, accounts } = useMsal()
  const accountId = 0
  const [folderTree, setFolderTree] = useState(['/'])
  const [updateType, updatePlayList, updateIndex, updateContainerIsHiding] = usePlayerStore(
    (state) => [
      state.updateType,
      state.updatePlayList,
      state.updateIndex,
      state.updateContainerIsHiding
    ]
  )

  /**
   * 实时获取当前路径
   */
  const path = useMemo(
    () => {
      return (folderTree.join('/') === '/') ? '/' : folderTree.slice(1).join('/')
    },
    [folderTree]
  )

  const fileListFetcher = (path: string) => getFilesData(path).then((res) => res)
  const { data, error, isLoading } = useSWR<any, Error, any>(path, fileListFetcher, { revalidateOnFocus: false })

  const getfileList = () => {
    if (isLoading) return null
    if (error) return null
    else
      return data.map((item: any) => {
        return {
          name: item.name,
          size: item.size,
          type: (item.file) ? 'file' : 'folder',
        }
      })
  }

  const fileList = getfileList()

  /**
   * 点击列表项
   * @param index 
   * @param name 
   * @param type 
   */
  const handleListClick = (index: number, name: string, type: string) => {
    console.log('点击的项目', index, name, type)
    // 点击文件夹时打开列表
    if (type === 'folder') setFolderTree([...folderTree, name])
    // 点击文件时将媒体文件添加到播放列表
    if (type === 'file' && fileList !== null && name !== null) {
      const list = fileList
        .map((item: any) => {
          return {
            name: item.name,
            size: item.size,
            path: path.concat(`/${item.name}`),
          }
        })
      if (isAudio(name)) {
        const lists = list.filter((item: { name: string }) => isAudio(item.name))
        const index = lists.findIndex((obj: { name: string }) => obj.name === name)
        updateType('audio')
        updateIndex(index)
        updatePlayList(lists)
      }
      if (isVideo(name)) {
        const lists = list.filter((item: { name: string }) => isVideo(item.name))
        const index = lists.findIndex((obj: { name: string }) => obj.name === name)
        updateType('video')
        updateIndex(index)
        updatePlayList(lists)
        updateContainerIsHiding(false)
      }
    }
  }

  /**
   * 点击文件夹导航
   * @param index 
   */
  const handleListNavClick = (index: number) => {
    setFolderTree(folderTree.slice(0, index + 1))
  }

  /**
   * 获取文件夹数据
   * @param path 
   * @returns 
   */
  const getFilesData = async (path: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[accountId] })
    const response = await getFiles(path, acquireToken.accessToken)
    return response.value
  }

  /**
   * 获取文件数据
   * @param filePath 
   * @returns 
   */
  const getFileData = async (filePath: string) => {
    const acquireToken = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[accountId] })
    const response = await getFile(filePath, acquireToken.accessToken)
    return response
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
          <Player
            getFileData={getFileData}
          />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div className='login'>
            <h5 >Please sign in to see your files.</h5>
            <SignInButton />
          </div>
        </UnauthenticatedTemplate>
      </div>
    </main>
  )
}

export default App