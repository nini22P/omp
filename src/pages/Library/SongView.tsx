import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { getCoverUrl } from '@/utils'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'

const SongView = () => {
  const { account } = useUser()
  const db = useDb(account)

  const songs = useLiveQuery(async () => await db?.metadata.orderBy('title').toArray(), [db])

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {songs?.map(song => (
          <ListItem key={song.id} disablePadding>
            <ListItemButton onClick={() => console.log(song)}>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  alt={song.title}
                  src={getCoverUrl(song.cover)}
                  slotProps={{ img: { loading: 'lazy' } }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.style.display = 'none'
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={song.title}
                secondary={[song.artist, song.album].filter(Boolean).join(' • ')}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default SongView