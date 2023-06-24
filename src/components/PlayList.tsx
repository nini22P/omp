import { useParams } from 'react-router-dom'
import shallow from 'zustand/shallow'
import usePlayListsStore from '../store/usePlayListsStore'

const PlayList = () => {
  const { id } = useParams()
  const [playLists] = usePlayListsStore((state) => [state.playLists], shallow)
  const playListItem = playLists?.find(playListItem => playListItem.id === id)
  return (
    <div>
      {
        (!playListItem)
          ?
          'null'
          :
          <div>
            {playListItem.title}
          </div>
      }
    </div>
  )
}

export default PlayList