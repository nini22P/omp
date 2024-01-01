import { useMemo } from 'react'
import useSWR from 'swr'
import usePlaylistsStore from '@/store/usePlaylistsStore'
import useHistoryStore from '@/store/useHistoryStore'
import useFilesData from './useFilesData'
import { File } from '@/types/file'
import { Playlist } from '@/types/playlist'
import { fetchJson } from '@/utils'
import useUser from './useUser'

const useSync = () => {
  const { account } = useUser()
  const [historyList, updateHistoryList] = useHistoryStore((state) => [state.historyList, state.updateHistoryList])
  const [playlists, updatePlaylists] = usePlaylistsStore((state) => [state.playlists, state.updatePlaylists])
  const { getAppRootFilesData, uploadAppRootJsonData } = useFilesData()

  // 自动从 OneDrive 获取应用数据
  const appDatafetcher = async () => {
    const appRootFiles = await getAppRootFilesData('/')
    const historyFile = appRootFiles.value.find((item: { name: string }) => item.name === 'history.json')
    const playlistsFile = appRootFiles.value.find((item: { name: string }) => item.name === 'playlists.json')
    let history = []
    let playlists = []

    if (historyFile) {
      history = await fetchJson(historyFile['@microsoft.graph.downloadUrl'])
    }
    if (playlistsFile) {
      playlists = await fetchJson(playlistsFile['@microsoft.graph.downloadUrl'])
    }
    console.log('Get app data')
    return {
      history: history.filter((item: File) => typeof item.filePath === 'object'),
      playlists: playlists.filter((item: Playlist) => typeof item.fileList === 'object')
    }
  }

  const { data, error, isLoading } = useSWR<{ history: File[], playlists: Playlist[] }>(account ? 'fetchAppData' : null, appDatafetcher)

  // 自动更新播放历史
  useMemo(
    () => {
      (!isLoading && !error && data?.history) && updateHistoryList(data.history)
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  // 自动上传播放历史
  useMemo(
    () => (historyList !== null) && uploadAppRootJsonData('history.json', JSON.stringify(historyList)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [historyList]
  )

  // 自动更新播放列表
  useMemo(
    () => {
      (!isLoading && !error && data?.playlists) && updatePlaylists(data.playlists)
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  // 自动上传播放列表
  useMemo(
    () => (playlists !== null) && uploadAppRootJsonData('playlists.json', JSON.stringify(playlists)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlists]
  )

}

export default useSync