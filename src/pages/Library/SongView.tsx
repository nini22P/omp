import { LibraryDB } from '@/db'
import useUser from '@/hooks/graph/useUser'
import useCreateImageUrl from '@/hooks/useCreateImageUrl'
import useDb from '@/hooks/useDb'
import usePlayerStore from '@/store/usePlayerStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import { FileNode } from '@/types/file'
import { MetaData } from '@/types/metaData'
import { fileNodeToTrack } from '@/utils/track'
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { CSSProperties } from 'react'
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

  const sortedMetadataIds = useLiveQuery(
    async () => await db?.metadata.orderBy('common.title').primaryKeys(),
    [db]
  )

  const listItems = useLiveQuery(
    async () => {
      if (!db || !sortedMetadataIds || sortedMetadataIds.length === 0) {
        return []
      }

      const [nodes, metadata] = await Promise.all([
        db.nodes.where('id').anyOf(sortedMetadataIds).toArray(),
        db.metadata.where('id').anyOf(sortedMetadataIds).toArray(),
      ])

      const nodeMap = new Map(nodes.map(node => [node.id, node]))
      const metaMap = new Map(metadata.map(meta => [meta.id, meta]))

      return sortedMetadataIds
        .map(id => {
          const node = nodeMap.get(id)
          const meta = metaMap.get(id)

          if (node) {
            return { node, meta }
          }
          return undefined
        })
        .filter((item): item is { node: FileNode; meta: MetaData | undefined } => item !== undefined)
    },
    [db, sortedMetadataIds],
  )

  if (!db || !listItems) return <div />

  const open = (index: number) => {
    if (listItems) {
      const list = listItems.map((item, _index) => ({ track: fileNodeToTrack(item.node), index: _index }))
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
            itemCount={listItems.length}
            itemSize={72}
            overscanCount={10}
          >
            {({ index, style }) => (
              <Row
                key={listItems[index].node.id ?? index}
                style={style}
                db={db}
                fileNode={listItems[index].node}
                song={listItems[index].meta}
                onPlay={() => open(index)}
              />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </List>
  )
}

const Row = (
  {
    style,
    db,
    fileNode,
    song,
    onPlay,
  }: {
    style: CSSProperties,
    db: LibraryDB,
    fileNode: FileNode,
    song: MetaData | undefined,
    onPlay: () => void,
  }
) => {
  const coverUrl = useCreateImageUrl(db, song)

  return (
    <ListItem key={song?.id ?? fileNode.id} style={style} disablePadding>
      <ListItemButton onClick={onPlay}>
        <ListItemAvatar>
          <Avatar
            variant="square"
            alt={song?.common.title}
            src={coverUrl}
            slotProps={{ img: { loading: 'lazy' } }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.style.display = 'none'
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={song ? song.common.title : fileNode.name}
          secondary={song ? [song.common.artist, song.common.album].filter(Boolean).join(' • ') : ' '}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default SongView