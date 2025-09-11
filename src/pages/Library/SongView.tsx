import { LibraryDB } from '@/db'
import useUser from '@/hooks/graph/useUser'
import useCreateImageUrl from '@/hooks/useCreateImageUrl'
import useDb from '@/hooks/useDb'
import usePlayerStore from '@/store/usePlayerStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import { FileNode } from '@/types/file'
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

  const fileNodes = useLiveQuery(
    async () => {
      if (!db || !sortedMetadataIds || sortedMetadataIds.length === 0) {
        return []
      }

      const nodes = await db.nodes.where('id').anyOf(sortedMetadataIds).toArray()
      const nodeMap = new Map(nodes.map(node => [node.id, node]))
      return sortedMetadataIds.map(id => nodeMap.get(id)).filter((node) => node !== undefined)
    },
    [db, sortedMetadataIds]
  )

  if (!db || !fileNodes) return <div />

  const open = (index: number) => {
    if (fileNodes) {
      const list = fileNodes.map((fileNode, _index) => ({ track: fileNodeToTrack(fileNode), index: _index }))
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
            itemCount={fileNodes.length}
            itemSize={72}
            overscanCount={10}
          >
            {({ index, style }) => (
              <Row
                key={fileNodes[index].id ?? index}
                style={style}
                db={db}
                fileNode={fileNodes[index]}
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
  { style, db, fileNode, onPlay }
    :
    { style: CSSProperties, db: LibraryDB, fileNode: FileNode, onPlay: () => void }
) => {
  const song = useLiveQuery(async () => await db?.metadata.get(fileNode.id), [db, fileNode.id])
  const coverUrl = useCreateImageUrl(song)
  return (
    <ListItem key={song?.id} style={style} disablePadding>
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