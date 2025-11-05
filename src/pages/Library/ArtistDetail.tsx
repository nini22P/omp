import { useNavigate, useParams } from 'react-router-dom'
import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLiveQuery } from 'dexie-react-hooks'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import { Box, Typography, IconButton, Avatar, ListItem, ListItemButton, ListItemAvatar, ListItemText } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loading from '../Loading'
import useUiStore from '@/store/useUiStore'
import useCreateImageUrl from '@/hooks/useCreateImageUrl'
import { CSSProperties, useMemo } from 'react'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'
import { FileNode } from '@/types/file'
import { MetaData } from '@/types/metaData'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import shufflePlayQueue from '@/utils/shufflePlayQueue'
import { fileNodeToTrack } from '@/utils/track'
import { LibraryDB } from '@/db'

const ArtistDetail = () => {
  const params = useParams<{ artist: string }>()
  const navigate = useNavigate()
  const { account } = useUser()
  const db = useDb(account)

  const artist = useMemo(() => decodeURIComponent(params.artist || ''), [params])

  const shuffle = useUiStore.use.shuffle()
  const updateShuffle = useUiStore.use.updateShuffle()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()
  const updateAutoPlay = usePlayerStore.use.updateAutoPlay()

  const fileNodes = useLiveQuery(async () => await db?.nodes.where('type').equals('audio').toArray(), [db])
  const fileNodeIds = useMemo(() => fileNodes?.map(node => node.id) ?? [], [fileNodes])

  const songsWithNodes = useLiveQuery(
    async () => {
      if (!db || !artist || fileNodeIds.length === 0) return []

      const songs = await db.metadata
        .where('id').anyOf(fileNodeIds)
        .filter(song =>
          (song.common.artists?.includes(artist) ?? false) ||
          (song.common.albumartists?.includes(artist) ?? false)
        )
        .toArray()

      songs.sort((a, b) => {
        const albumA = a.common.album || ''
        const albumB = b.common.album || ''
        if (albumA !== albumB) return albumA.localeCompare(albumB)

        const diskA = a.common.disk?.no ?? 1
        const diskB = b.common.disk?.no ?? 1
        if (diskA !== diskB) return diskA - diskB

        return (a.common.track.no ?? 0) - (b.common.track.no ?? 0)
      })

      const nodeMap = new Map(fileNodes?.map(node => [node.id, node]))
      return songs
        .map(meta => {
          const node = nodeMap.get(meta.id)
          if (node) {
            return { node, meta }
          }
          return undefined
        })
        .filter((item): item is { node: FileNode; meta: MetaData } => !!item)
    },
    [db, artist, fileNodeIds],
    []
  )

  const open = (index: number) => {
    if (songsWithNodes) {
      const list = songsWithNodes.map((item, _index) => ({ track: fileNodeToTrack(item.node), index: _index }))
      if (shuffle) {
        updateShuffle(false)
      }
      updatePlayQueue(list ?? [])
      updateCurrentIndex(index)
      updateAutoPlay(true)
    }
  }

  const playAll = () => {
    if (songsWithNodes && songsWithNodes.length > 0) {
      open(0)
    }
  }

  const shuffleAll = () => {
    if (songsWithNodes) {
      const list = songsWithNodes.map((item, index) => ({ track: fileNodeToTrack(item.node), index }))
      if (!shuffle) {
        updateShuffle(true)
      }
      const shuffledList = shufflePlayQueue(list ?? [])
      updatePlayQueue(shuffledList)
      updateCurrentIndex(shuffledList[0]?.index ?? 0)
      updateAutoPlay(true)
    }
  }

  if (!songsWithNodes || !db) {
    return <Loading />
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/library/artists')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>{artist}</Typography>
      </Box>

      <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1 }}>
        <IconButton onClick={playAll}><PlayArrowIcon /></IconButton>
        <IconButton onClick={shuffleAll}><ShuffleIcon /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemCount={songsWithNodes.length}
              itemSize={72}
              overscanCount={10}
            >
              {({ index, style }) => {
                const item = songsWithNodes[index]
                return (
                  <SongRow
                    key={item.node.id ?? index}
                    style={style}
                    db={db}
                    fileNode={item.node}
                    song={item.meta}
                    onPlay={() => open(index)}
                  />
                )
              }}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </Box>
  )
}

const SongRow = (
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
          secondary={song ? [song.common.artists?.join('; '), song.common.album].filter(Boolean).join(' • ') : ' '}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default ArtistDetail