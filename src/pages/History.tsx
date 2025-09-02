import useHistoryStore from '../store/useHistoryStore'
import CommonList from '../components/CommonList/CommonList'
import Loading from './Loading'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { useShallow } from 'zustand/shallow'
import { isVideo } from '@/utils/checkFileType'

const History = () => {
  const [historys, removeHistory] = useHistoryStore(
    useShallow((state) => [state.historys, state.removeHistory])
  )
  const [shuffle, updateVideoViewIsShow, updateShuffle,] = useUiStore(
    useShallow((state) => [state.shuffle, state.updateVideoViewIsShow, state.updateShuffle])
  )

  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const updateAutoPlay = usePlayerStore(state => state.updateAutoPlay)

  const open = async (index: number) => {
    const listData = historys
    if (listData) {
      const currentFile = listData[index]
      if (currentFile) {
        const list = listData.map((item, _index) => ({ track: item, index: _index }))
        if (shuffle) {
          updateShuffle(false)
        }
        updatePlayQueue(list)
        updateCurrentIndex(list[index].index)
        updateAutoPlay(true)
        if (isVideo(currentFile.name)) {
          updateVideoViewIsShow(true)
        }
      }
    }
  }

  const remove = async (indexArray: number[]) => {
    removeHistory(indexArray)
  }

  return (
    <div style={{ height: '100%' }}>
      {
        (!historys) ? <Loading />
          : <CommonList
            listData={historys}
            listType='files'
            func={{ open, remove }}
          />
      }
    </div>
  )
}

export default History