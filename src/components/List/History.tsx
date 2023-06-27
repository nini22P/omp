import useHistoryStore from '../../store/useHistoryStore'
import { shallow } from 'zustand/shallow'
import FileList from './FileList'
import Loading from '../Loading'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)

  return (
    <>
      {
        (!historyList)
          ? <Loading />
          : <FileList
            fileList={historyList}
            handleClickRemove={removeHistoryItem}
          />
      }
    </>
  )
}

export default History