import { shallow } from 'zustand/shallow'
import useHistoryStore from '../store/useHistoryStore'
import CommonList from './CommonList/CommonList'
import Loading from './Loading'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)

  return (
    <>
      {
        (!historyList) ? <Loading />
          : <CommonList
            listData={historyList}
            handleClickRemove={removeHistoryItem}
          />
      }
    </>
  )
}

export default History