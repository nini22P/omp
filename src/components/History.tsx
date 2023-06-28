import useHistoryStore from '../store/useHistoryStore'
import { shallow } from 'zustand/shallow'
import CommonList from './CommonList/CommonList'
import Loading from './Loading'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)

  return (
    <>
      {
        (!historyList) ? <Loading />
          : <CommonList
            fileList={historyList}
            handleClickRemove={removeHistoryItem}
          />
      }
    </>
  )
}

export default History