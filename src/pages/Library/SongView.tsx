import useUser from '@/hooks/graph/useUser'
import useCreateImageUrl from '@/hooks/useCreateImageUrl'
import useDb from '@/hooks/useDb'
import usePlayerStore from '@/store/usePlayerStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import { MetaData } from '@/types/metaData'
import { fileNodeToTrack } from '@/utils/track'
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { CSSProperties, useMemo } from 'react'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'

const SongView = () => {
  const { account } = useUser()
  const db = useDb(account)

  const shuffle = useUiStore.use.shuffle()
  const updateShuffle = useUiStore.use.updateShuffle()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()
  const updateAutoPlay = usePlayerStore.use.updateAutoPlay()

  const fileNodes = useLiveQuery(async () => await db?.nodes.where('type').equals('audio').toArray(), [db])
  const fileNodeIds = useMemo(() => fileNodes?.map(node => node.id), [fileNodes])
  const songs = useLiveQuery(
    () => {
      if (!db || !fileNodeIds || fileNodeIds.length === 0) {
        return []
      }
      return db.metadata
        .where('id')
        .anyOf(fileNodeIds)
        .sortBy('common.title')
    },
    [db, fileNodeIds]
  )

  if (!songs)
    return <div />

  const open = (index: number) => {
    if (songs) {
      const list = songs
        .map((item, _index) => {
          const fileNode = fileNodes?.find(node => node.id === item.id)
          if (!fileNode) return undefined
          return { track: fileNodeToTrack(fileNode), index: _index }
        })
        .filter((item) => item !== undefined)
      if (shuffle) {
        updateShuffle(false)
      }
      updatePlayQueue(list ?? [])
      updateCurrentIndex(index)
      updateAutoPlay(true)
    }
  }

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
              <Row key={songs[index]?.id ?? index} index={index} style={style} songs={songs} onPlay={() => open(index)} />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </List>
  )
}

const Row = (
  { index, style, songs, onPlay }
    :
    { index: number, style: CSSProperties, songs: MetaData[], onPlay: () => void }
) => {
  const coverUrl = useCreateImageUrl(songs[index])
  return (
    <ListItem key={songs[index]?.id ?? index} style={style} disablePadding>
      <ListItemButton onClick={onPlay}>
        <ListItemAvatar>
          <Avatar
            variant="square"
            alt={songs[index]?.common.title}
            src={coverUrl}
            slotProps={{ img: { loading: 'lazy' } }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.style.display = 'none'
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={songs[index]?.common.title}
          secondary={[songs[index]?.common.artist, songs[index]?.common.album].filter(Boolean).join(' • ')}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default SongView