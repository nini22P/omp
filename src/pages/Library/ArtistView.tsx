import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'

const ArtistView = () => {

  const { account } = useUser()
  const db = useDb(account)

  const artists = useLiveQuery(
    async () =>
      db
        ? (
          await db.metadata
            .orderBy('albumArtist')
            .uniqueKeys()
        ).filter((artist): artist is string => typeof artist === 'string')
        : [],
    [db]
  )

  if (!artists)
    return <div />

  return (
    <List sx={{ width: '100%', height: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={artists.length}
            itemSize={48}
          >
            {({ index, style }) => (
              <ListItem key={artists[index]} style={style} disablePadding>
                <ListItemButton onClick={() => console.log(artists[index])}>
                  <ListItemText
                    primary={artists[index]}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </List>
  )
}

export default ArtistView