import { List, ListItem, ListItemText, ListItemIcon, ListItemButton, Button, useTheme } from '@mui/material'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import { NavLink, useNavigate } from 'react-router-dom'
import usePlayListsStore from '../../store/usePlayListsStore'
import { shallow } from 'zustand/shallow'
import shortUUID from 'short-uuid'
import { useTranslation } from 'react-i18next'
const PlayLists = ({ closeSideBar }: { closeSideBar: () => void }) => {
  const { t } = useTranslation()
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
    insertPlayListsItem({ id, title: t('playlist.newPlaylist'), playList: [] })
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
              <ListItemText
                primary={playListsItem.title}
                primaryTypographyProps={{
                  style: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
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
            {t('playlist.addPlaylist')}
          </Button>
        </ListItemText>
      </ListItem >
    </List>
  )
}

export default PlayLists