import useHistoryStore from '../store/useHistoryStore'
import CommonList from '../components/CommonList/CommonList'
import Loading from './Loading'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { checkFileType } from '@/utils'

const History = () => {
  const [historyList, removeHistory] = useHistoryStore((state) => [state.historyList, state.removeHistory])
  const [shuffle, updateVideoViewIsShow, updateShuffle,] = useUiStore((state) => [state.shuffle, state.updateVideoViewIsShow, state.updateShuffle])
  const [updatePlayQueue, updateCurrentIndex] = usePlayQueueStore((state) => [state.updatePlayQueue, state.updateCurrentIndex])
  const [updatePlayStatu] = usePlayerStore(state => [state.updatePlayStatu])

  const open = (index: number) => {
    const listData = historyList
    if (listData) {
      const currentFile = listData[index]
      if (currentFile) {
        const list = listData
          .map((item, _index) => ({ ...item, index: _index }))
        if (shuffle) {
          updateShuffle(false)
        }
        updatePlayQueue(list)
        updateCurrentIndex(list[index].index)
        updatePlayStatu('playing')
        if (checkFileType(currentFile.fileName) === 'video') {
          updateVideoViewIsShow(true)
        }
      }
    }
  }

  return (
    <div style={{ height: '100%' }}>
      {
        (!historyList) ? <Loading />
          : <CommonList
            listData={historyList}
            listType='files'
            func={{ open, remove: removeHistory }}
          />
      }
    </div>
  )
}

export default History