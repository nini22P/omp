import { useMemo } from 'react'
import useHistoryStore from '../store/useHistoryStore'
import useFilesData from './useFilesData'
import { fetchJson } from '../services'
import { shallow } from 'zustand/shallow'
import useSWR from 'swr'

const useSync = () => {
  const [historyList, updateHistoryList] = useHistoryStore((state) => [state.historyList, state.updateHistoryList], shallow)
  const { getAppRootFilesData, uploadAppRootJsonData } = useFilesData()

  // 自动从 OneDrive 获取配置
  const appConfigfetcher = async () => {
    const appRootFiles = await getAppRootFilesData('/')
    const historyitem = appRootFiles.value.filter((item: { name: string }) => item.name === 'history.json')[0]
    let history = []
    if (historyitem) {
      history = await fetchJson(historyitem['@microsoft.graph.downloadUrl'])
    }
    return {
      history: history.filter((item: { filePath: string }) => item.filePath),
    }
  }
  const { data: appConfigData, error: appConfigError, isLoading: appConfigIsLoading } = useSWR('appConfig', appConfigfetcher)
  console.log('Get appConfigData')

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

}

export default useSync