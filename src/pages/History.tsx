import useHistoryStore from '../store/useHistoryStore'
import CommonList from '../components/CommonList/CommonList'
import Loading from './Loading'

const History = () => {
  const [historyList, removeHistory] = useHistoryStore((state) => [state.historyList, state.removeHistory])

  return (
    <div style={{ height: '100%' }}>
      {
        (!historyList) ? <Loading />
          : <CommonList
            listData={historyList}
            func={{ handleClickRemove: removeHistory }}
          />
      }
    </div>
  )
}

export default History