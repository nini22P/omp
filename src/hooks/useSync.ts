import { useMemo } from 'react'
import useHistoryStore from '../store/useHistoryStore'
import useFilesData from './useFilesData'
import { fetchJson } from '../service'
import { shallow } from 'zustand/shallow'

const useSync = () => {
  const [historyList, updateHistoryList] = useHistoryStore((state) => [state.historyList, state.updateHistoryList], shallow)
  const { getAppRootFilesData, uploadAppRootJsonData } = useFilesData()

  useMemo(() => {
    if (historyList === null) {
      getAppRootFilesData('/').then(res => {
        const history = res.value.filter((item: { name: string }) => item.name === 'history.json')[0]
        if (history) {
          console.log('获取历史记录')
          fetchJson(history['@microsoft.graph.downloadUrl']).then(json => updateHistoryList(json))
        }
      })
    } else {
      uploadAppRootJsonData('history.json', JSON.stringify(historyList))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyList])
}

export default useSync