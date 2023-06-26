import { useMemo } from 'react'
import useHistoryStore from '../store/useHistoryStore'
import useFilesData from './useFilesData'
import { fetchJson } from '../services'
import { shallow } from 'zustand/shallow'
import useSWR from 'swr'
import usePlayListsStore from '../store/usePlayListsStore'

const useSync = () => {
  const [historyList, updateHistoryList] = useHistoryStore((state) => [state.historyList, state.updateHistoryList], shallow)
  const [playLists, updatePlayLists] = usePlayListsStore((state) => [state.playLists, state.updatePlayLists], shallow)
  const { getAppRootFilesData, uploadAppRootJsonData } = useFilesData()

  // 自动从 OneDrive 获取配置
  const appConfigfetcher = async () => {
    const appRootFiles = await getAppRootFilesData('/')
    const historyFile = appRootFiles.value.find((item: { name: string }) => item.name === 'history.json')
    const playListsFile = appRootFiles.value.find((item: { name: string }) => item.name === 'playlists.json')
    let history = []
    let playLists = []
    if (historyFile) {
      history = await fetchJson(historyFile['@microsoft.graph.downloadUrl'])
    }
    if (playListsFile) {
      playLists = await fetchJson(playListsFile['@microsoft.graph.downloadUrl'])
    }
    return {
      history: history.filter((item: { filePath: string }) => item.filePath),
      playLists: playLists.filter((item: { id: string }) => item.id)
    }
  }
  const { data: appConfigData, error: appConfigError, isLoading: appConfigIsLoading } = useSWR('appConfig', appConfigfetcher)
  console.log('Get appConfigData', appConfigData)

  // 自动更新播放历史
  useMemo(() => {
    if (!appConfigIsLoading && !appConfigError && appConfigData && appConfigData?.history !== '[]')
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
    if (!appConfigIsLoading && !appConfigError && appConfigData && appConfigData?.playLists !== '[]')
      updatePlayLists(appConfigData.playLists)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfigData])

  // 自动上传播放列表
  useMemo(() => {
    if (playLists !== null) {
      uploadAppRootJsonData('playlists.json', JSON.stringify(playLists))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playLists])

}

export default useSync