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
    async () => {
      if (!db) return []

      const fileNodes = await db.nodes.where('type').equals('audio').toArray()
      const fileNodeIds = fileNodes.map(node => node.id)

      if (fileNodeIds.length === 0) {
        return []
      }

      const allSongs = await db.metadata
        .where('id').anyOf(fileNodeIds)
        .toArray()

      const allArtistNames = allSongs.flatMap(song => [
        ...(song.common.artists || []),
        ...(song.common.albumartists || [])
      ]);

      const uniqueArtists = new Set(allArtistNames)

      return Array.from(uniqueArtists).sort()
    },
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
                <ListItemButton component="a" href={`#/library/artists/${encodeURIComponent(artists[index])}`}>
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