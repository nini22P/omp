import useUser from '@/hooks/graph/useUser'
import useCreateCoverUrl from '@/hooks/useCreateCoverUrl'
import useDb from '@/hooks/useDb'
import { MetaData } from '@/types/metaData'
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { CSSProperties } from 'react'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'

const SongView = () => {
  const { account } = useUser()
  const db = useDb(account)

  const songs = useLiveQuery(async () => await db?.metadata.orderBy('title').toArray(), [db])

  if (!songs)
    return <div />

  return (
    <List sx={{ width: '100%', height: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={songs.length}
            itemSize={72}
          >
            {({ index, style }) => (
              <Row key={songs[index]?.id ?? index} index={index} style={style} songs={songs} />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </List>
  )
}

const Row = ({ index, style, songs }: { index: number, style: CSSProperties, songs: MetaData[] }) => {
  const coverUrl = useCreateCoverUrl(songs[index])
  return (
    <ListItem key={songs[index]?.id ?? index} style={style} disablePadding>
      <ListItemButton onClick={() => console.log(songs[index])}>
        <ListItemAvatar>
          <Avatar
            variant="square"
            alt={songs[index]?.title}
            src={coverUrl}
            slotProps={{ img: { loading: 'lazy' } }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.style.display = 'none'
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={songs[index]?.title}
          secondary={[songs[index]?.artist, songs[index]?.album].filter(Boolean).join(' • ')}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default SongView