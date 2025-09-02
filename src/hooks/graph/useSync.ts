import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import usePlaylistsStore from '@/store/usePlaylistsStore'
import useHistoryStore from '@/store/useHistoryStore'
import useGraph from './useGraph'
import { FileItem, Track } from '@/types/file'
import { OldPlaylist, Playlist } from '@/types/playlist'
import { fetchJson } from '@/utils'
import useUser from './useUser'
import { useShallow } from 'zustand/shallow'
import { useMsal } from '@azure/msal-react'

const useSync = () => {
  const { instance } = useMsal()
  const { account } = useUser()

  const [historys, updateHistoryList] = useHistoryStore(
    useShallow((state) => [state.historys, state.updateHistoryList])
  )
  const [playlists, updatePlaylists] = usePlaylistsStore(
    useShallow((state) => [state.playlists, state.updatePlaylists])
  )
  const { getAppRootFilesData, uploadAppRootJsonData } = useGraph(instance, account)

  function isFileItem(item: unknown): item is FileItem {
    return typeof item === 'object' && item !== null && 'fileName' in item && 'filePath' in item
  }

  function isOldPlaylist(playlist: unknown): playlist is OldPlaylist {
    return typeof playlist === 'object' && playlist !== null && 'title' in playlist && 'fileList' in playlist
  }

  // 自动从 OneDrive 获取应用数据
  const appDatafetcher = async () => {
    if (!account) return {
      history: [],
      playlists: [],
    }

    const appRootFiles = await getAppRootFilesData()
    const historyFile = appRootFiles.value.find((item: { name: string }) => item.name === 'history.json')
    const playlistsFile = appRootFiles.value.find((item: { name: string }) => item.name === 'playlists.json')
    let remoteHistory: FileItem[] | Track[] = []
    let remotePlaylists: OldPlaylist[] | Playlist[] = []

    if (historyFile) {
      remoteHistory = await fetchJson(historyFile['@microsoft.graph.downloadUrl'])
    }
    if (playlistsFile) {
      remotePlaylists = await fetchJson(playlistsFile['@microsoft.graph.downloadUrl'])
    }

    console.log('Get app data')

    const history: Track[] = remoteHistory.map((item) =>
      isFileItem(item)
        ? ({
          id: '',
          name: item.fileName,
          path: item.filePath.filter((item: string) => item !== '/'),
          size: item.fileSize,
        })
        : item
    )

    const playlists: Playlist[] = remotePlaylists.map((playlist) =>
      isOldPlaylist(playlist)
        ? ({
          id: playlist.id,
          name: playlist.title,
          files: playlist.fileList.map((item) => ({
            id: '',
            name: item.fileName,
            path: item.filePath.filter((item: string) => item !== '/'),
            size: item.fileSize,
          })),
        })
        : playlist
    )

    return {
      history,
      playlists,
    }
  }

  const { data, error, isLoading } = useSWR<{ history: Track[], playlists: Playlist[] }>(
    account ? `${account.username}/fetchAppData` : null,
    appDatafetcher,
  )

  // 自动更新播放历史
  useEffect(
    () => {
      if (!isLoading && !error && data?.history) {
        updateHistoryList(data.history)
      }
    },
    [data, error, isLoading, updateHistoryList]
  )

  // 自动上传播放历史
  useMemo(
    () => (historys !== null) && uploadAppRootJsonData('history.json', JSON.stringify(historys)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [historys]
  )

  // 自动更新播放列表
  useEffect(
    () => {
      if (!isLoading && !error && data?.playlists) {
        updatePlaylists(data.playlists)
      }
    },
    [data, error, isLoading, updatePlaylists]
  )

  // 自动上传播放列表
  useMemo(
    () => (playlists !== null) && uploadAppRootJsonData('playlists.json', JSON.stringify(playlists)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlists]
  )

}

export default useSync