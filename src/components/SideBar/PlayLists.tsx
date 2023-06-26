import { List, ListItem, ListItemText, ListItemIcon, ListItemButton, Button, useTheme } from '@mui/material'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import { NavLink, useNavigate } from 'react-router-dom'
import usePlayListsStore from '../../store/usePlayListsStore'
import { shallow } from 'zustand/shallow'
import shortUUID from 'short-uuid'
const PlayLists = ({ closeSideBar }: { closeSideBar: () => void }) => {
  const theme = useTheme()
  const styles = {
    active: {
      '&.active': {
        color: theme.palette.primary.main,
      },
      '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
    }
  }
  const navigate = useNavigate()
  const [playLists, insertPlayListsItem] = usePlayListsStore((state) => [state.playLists, state.insertPlayListsItem], shallow)

  const addPlayList = () => {
    const id = shortUUID().generate()
    insertPlayListsItem({ id, title: 'New Playlist', playList: [] })
    return navigate(`/playlist/${id}`)
  }
  return (
    <List>
      {
        playLists?.map((playListsItem, index) =>
          <ListItem
            disablePadding
            key={index}
          >
            <ListItemButton
              component={NavLink}
              sx={styles.active}
              to={`/playlist/${playListsItem.id}`}
              onClick={closeSideBar}
            >
              <ListItemIcon>
                <ListOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={playListsItem.title} />
            </ListItemButton>
          </ListItem >
        )
      }
      <ListItem>
        <ListItemText>
          <Button
            startIcon={<PlaylistAddOutlinedIcon />}
            onClick={addPlayList}
          >
            Add PlayList
          </Button>
        </ListItemText>
      </ListItem >
    </List>
  )
}

export default PlayLists