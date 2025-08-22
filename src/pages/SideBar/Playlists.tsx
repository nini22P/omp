import { NavLink, useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { List, ListItem, ListItemText, ListItemIcon, ListItemButton, Button } from '@mui/material'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import { useShallow } from 'zustand/shallow'
import { useLingui } from '@lingui/react/macro'

const Playlists = ({ closeSideBar }: { closeSideBar: () => void }) => {
  const { t } = useLingui()

  const navigate = useNavigate()
  const [playlists, insertPlaylist] = usePlaylistsStore(
    useShallow((state) => [state.playlists, state.insertPlaylist])
  )

  const addPlaylist = async () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, name: t`New playlist`, files: [] })
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
              <ListItemText primary={playlist.name} />
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
            {t`Add playlist`}
          </Button>
        </ListItemText>
      </ListItem >
    </List>
  )
}

export default Playlists