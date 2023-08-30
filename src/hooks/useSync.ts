import { useMemo } from 'react'
import useSWR from 'swr'
import usePlaylistsStore from '../store/usePlaylistsStore'
import useHistoryStore from '../store/useHistoryStore'
import useFilesData from './useFilesData'
import { fetchJson } from '../services'
import { AccountInfo } from '@azure/msal-browser'
import { File } from '../types/file'
import { Playlist } from '../types/playlist'

const useSync = (accounts: AccountInfo[]) => {
  const [historyList, updateHistoryList] = useHistoryStore((state) => [state.historyList, state.updateHistoryList])
  const [playlists, updatePlaylists] = usePlaylistsStore((state) => [state.playlists, state.updatePlaylists])
  const { getAppRootFilesData, uploadAppRootJsonData } = useFilesData()

  // 自动从 OneDrive 获取配置
  const appConfigfetcher = async () => {
    if (accounts.length === 0)
      return {
        history: null,
        playlists: null,
      }
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
    console.log('Get appConfigData')
    return {
      history: history.filter((item: File) => typeof item.filePath === 'object'),
      playlists: playlists.filter((item: Playlist) => typeof item.fileList === 'object')
    }
  }
  const { data: appConfigData, error: appConfigError, isLoading: appConfigIsLoading } = useSWR<{ history: File[], playlists: Playlist[] }>('appConfig', appConfigfetcher)

  // 自动更新播放历史
  useMemo(() => {
    if (!appConfigIsLoading && !appConfigError && appConfigData?.history)
      updateHistoryList(appConfigData.history)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfigData])

  // 自动上传播放历史
  useMemo(() => {
    if (historyList !== null) {
      uploadAppRootJsonData('history.json', JSON.stringify(historyList))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyList])

  // 自动更新播放列表
  useMemo(() => {
    if (!appConfigIsLoading && !appConfigError && appConfigData?.playlists)
      updatePlaylists(appConfigData.playlists)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfigData])

  // 自动上传播放列表
  useMemo(() => {
    if (playlists !== null) {
      uploadAppRootJsonData('playlists.json', JSON.stringify(playlists))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists])

}

export default useSync