import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { List, ListItem, ListItemText, ListItemIcon, ListItemButton, Button } from '@mui/material'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import usePlaylistsStore from '../../store/usePlaylistsStore'

const Playlists = ({ closeSideBar }: { closeSideBar: () => void }) => {

  const { t } = useTranslation()
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
            sx={{ paddingTop: '0.25rem' }}
          >
            <ListItemButton
              component={NavLink}
              to={`/playlist/${playlist.id}`}
              onClick={closeSideBar}
            >
              <ListItemIcon>
                <ListRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={playlist.title} />
            </ListItemButton>
          </ListItem >
        )
      }
      <ListItem>
        <ListItemText>
          <Button
            startIcon={<PlaylistAddRoundedIcon />}
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