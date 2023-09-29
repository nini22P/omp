import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { List, ListItem, ListItemText, ListItemIcon, ListItemButton, Button } from '@mui/material'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import useTheme from '../../hooks/useTheme'

const Playlists = ({ closeSideBar }: { closeSideBar: () => void }) => {

  const { t } = useTranslation()
  const { styles } = useTheme()
  const navigate = useNavigate()
  const [playlists, insertPlaylist] = usePlaylistsStore((state) => [state.playlists, state.insertPlaylist])

  const addPlaylist = async () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, title: t('playlist.newPlaylist'), fileList: [] })
    return navigate(`/playlist/${id}`)
  }

  return (
    playlists &&
    <List>
      {
        playlists?.map((playlist, index) =>
          <ListItem
            disablePadding
            key={index}
          >
            <ListItemButton
              component={NavLink}
              sx={styles.navListItem}
              to={`/playlist/${playlist.id}`}
              onClick={closeSideBar}
            >
              <ListItemIcon>
                <ListOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={playlist.title}
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
            onClick={addPlaylist}
          >
            {t('playlist.addPlaylist')}
          </Button>
        </ListItemText>
      </ListItem >
    </List>
  )
}

export default Playlists