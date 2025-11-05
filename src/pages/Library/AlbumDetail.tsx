import { useNavigate, useParams } from 'react-router-dom'
import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLiveQuery } from 'dexie-react-hooks'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import { Box, Typography, IconButton, Grid, CardMedia, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, ListItemIcon } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loading from '../Loading'
import { useLingui } from '@lingui/react/macro'
import useUiStore from '@/store/useUiStore'
import useCreateImageUrl from '@/hooks/useCreateImageUrl'
import { CSSProperties, useMemo } from 'react'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'
import { MetaData } from '@/types/metaData'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import shufflePlayQueue from '@/utils/shufflePlayQueue'
import { fileNodeToTrack } from '@/utils/track'

const SEPARATOR = '\u001f'

const AlbumDetail = () => {
  const params = useParams<{ albumartists: string, album: string }>()
  const { t } = useLingui()
  const navigate = useNavigate()
  const { account } = useUser()
  const db = useDb(account)

  const { albumartists, album } = useMemo(() => ({
    albumartists: decodeURIComponent(params.albumartists || '').split(SEPARATOR),
    album: decodeURIComponent(params.album || ''),
  }), [params])

  const shuffle = useUiStore.use.shuffle()
  const updateShuffle = useUiStore.use.updateShuffle()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()
  const updateAutoPlay = usePlayerStore.use.updateAutoPlay()

  const fileNodes = useLiveQuery(async () => await db?.nodes.where('type').equals('audio').toArray(), [db])
  const fileNodeIds = useMemo(() => fileNodes?.map(node => node.id) ?? [], [fileNodes])

  const songs = useLiveQuery(
    async () => {
      if (!db)
        return []

      if (fileNodeIds.length === 0) {
        return []
      }

      if (albumartists[0] === '_NO_ARTIST_') {
        return db.metadata
          .where('common.album')
          .equals(album)
          .filter(song => fileNodeIds.includes(song.id))
          .toArray()
          .then(songs => songs.sort((a, b) => {
            const diskA = a.common.disk?.no ?? 1
            const diskB = b.common.disk?.no ?? 1

            if (diskA !== diskB) {
              return diskA - diskB
            }

            return (a.common.track.no ?? 0) - (b.common.track.no ?? 0)
          }))
      }

      return db.metadata
        .where('common.album')
        .equals(album)
        .filter(song => fileNodeIds.includes(song.id) && albumartists.every(artist => song.common.albumartists?.includes(artist)))
        .toArray()
        .then(songs => songs.sort((a, b) => {
          const diskA = a.common.disk?.no ?? 1
          const diskB = b.common.disk?.no ?? 1

          if (diskA !== diskB) {
            return diskA - diskB
          }

          return (a.common.track.no ?? 0) - (b.common.track.no ?? 0)
        }))
    },
    [db, albumartists, album, fileNodeIds],
    []
  )

  const albumInfo = useMemo(() => songs?.[0], [songs])
  const coverUrl = useCreateImageUrl(db, albumInfo)

  const totalDiscs = useMemo(() => {
    if (!songs || songs.length === 0) return 1
    return Math.max(...songs.map(s => s.common.disk?.no ?? 1))
  }, [songs])

  const isMultiDisc = totalDiscs > 1

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

  const playAll = () => {
    if (songs && songs.length > 0) {
      open(0)
    }
  }

  const shuffleAll = () => {
    if (songs) {
      const list = fileNodes
        ?.filter(node => songs.map(song => song.id).includes(node.id))
        .map((item, index) => ({ track: fileNodeToTrack(item), index }))
      if (!shuffle) {
        updateShuffle(true)
      }
      const shuffledList = shufflePlayQueue(list ?? [])
      updatePlayQueue(shuffledList)
      updateCurrentIndex(shuffledList[0]?.index ?? 0)
      updateAutoPlay(true)
    }
  }

  if (!songs || !albumInfo || !db) {
    return <Loading />
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/library/albums')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>{album}</Typography>
      </Box>
      <Grid container sx={{ px: 2, pb: 2 }}>
        <Grid>
          <CardMedia
            component="img"
            sx={{ width: '100%', aspectRatio: '1/1', borderRadius: 1, height: 96 }}
            image={coverUrl}
            alt={album}
          />
        </Grid>
        <Grid sx={{ pl: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">{albumartists.join('; ')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t`${songs.length} songs`}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <IconButton onClick={playAll}><PlayArrowIcon /></IconButton>
            <IconButton onClick={shuffleAll}><ShuffleIcon /></IconButton>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemCount={songs.length}
              itemSize={72}
            >
              {({ index, style }) => (
                <SongRow
                  key={songs[index]?.id ?? index}
                  index={index}
                  style={style}
                  songs={songs}
                  isMultiDisc={isMultiDisc}
                  onPlay={() => open(index)}
                />
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </Box>
  )
}

const SongRow = (
  {
    index,
    style,
    songs,
    isMultiDisc,
    onPlay,
  }: {
    index: number,
    style: CSSProperties,
    songs: MetaData[],
    isMultiDisc: boolean,
    onPlay: () => void,
  }
) => {
  const song = songs[index]

  const trackDisplay = useMemo(() => {
    const track = song.common.track.no ?? 0
    if (!isMultiDisc) {
      return track
    }

    const disc = song.common.disk?.no ?? 1
    const paddedTrack = String(track).padStart(2, '0')

    return `${disc}. ${paddedTrack}`
  }, [song, isMultiDisc])

  return (
    <ListItem style={style} disablePadding>
      <ListItemButton onClick={onPlay}>
        <ListItemIcon sx={{ minWidth: 40, justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {trackDisplay}
          </Typography>
        </ListItemIcon>
        <ListItemText
          primary={song?.common.title}
          secondary={song?.common.artists?.join('; ')}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default AlbumDetail