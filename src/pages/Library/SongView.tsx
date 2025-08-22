import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
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
              <ListItemText
                primary={song.title}
                secondary={song.artist || 'Unknown Artist'}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default SongView