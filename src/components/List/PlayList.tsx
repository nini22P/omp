import { useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import usePlayListsStore from '../../store/usePlayListsStore'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'

const PlayList = () => {
  const { id } = useParams()
  const [playLists, updatePlayListsItem] = usePlayListsStore((state) => [state.playLists, state.updatePlayListsItem], shallow)
  const playListItem = playLists?.find(playListItem => playListItem.id === id)
  return (
    <div>
      {
        (playListItem) &&
        <div>
          {playListItem.title}
          <List>
            {
              playListItem.playList.map(item =>
                <ListItem>
                  <ListItemButton>
                    <ListItemText primary={item.fileName} secondary={item.fileSize} />
                  </ListItemButton>
                </ListItem>
              )
            }
          </List>
        </div>
      }
    </div>
  )
}

export default PlayList