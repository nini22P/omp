import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'

const ArtistView = () => {

  const { account } = useUser()
  const db = useDb(account)

  const artists = useLiveQuery(async () => await db?.metadata.orderBy('artist').uniqueKeys(), [db])

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {artists?.map(artist => (
          <ListItem key={String(artist)} disablePadding>
            <ListItemButton onClick={() => console.log(artist)}>
              <ListItemText
                primary={String(artist)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default ArtistView