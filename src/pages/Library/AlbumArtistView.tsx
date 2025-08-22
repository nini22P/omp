import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'

const AlbumArtistView = () => {

  const { account } = useUser()
  const db = useDb(account)

  const albumArtists = useLiveQuery(async () => await db?.metadata.orderBy('albumArtist').uniqueKeys(), [db])

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {albumArtists?.map(albumArtist => (
          <ListItem key={String(albumArtist)} disablePadding>
            <ListItemButton onClick={() => console.log(albumArtist)}>
              <ListItemText
                primary={String(albumArtist)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default AlbumArtistView