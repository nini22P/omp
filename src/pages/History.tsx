import useHistoryStore from '../store/useHistoryStore'
import CommonList from '../components/CommonList/CommonList'
import Loading from './Loading'

const History = () => {
  const [historyList, removeHistory] = useHistoryStore((state) => [state.historyList, state.removeHistory])

  return (
    <div style={{ padding: '0.5rem 0 1rem 0' }}>
      {
        (!historyList) ? <Loading />
          : <CommonList
            listData={historyList}
            handleClickRemove={removeHistory}
          />
      }
    </div>
  )
}

export default History