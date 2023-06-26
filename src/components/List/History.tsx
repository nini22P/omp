import useHistoryStore from '../../store/useHistoryStore'
import { shallow } from 'zustand/shallow'
import FileList from './FileList'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)

  return (
    <>
      {
        (historyList) &&
        <FileList
          fileList={historyList}
          handleClickRemove={removeHistoryItem}
        />
      }
    </>
  )
}

export default History