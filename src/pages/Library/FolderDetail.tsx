import { useNavigate, useParams } from 'react-router-dom'
import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLiveQuery } from 'dexie-react-hooks'
import CommonList from '@/components/CommonList/CommonList'
import { fileNodeToTrack, isAudio, isVideo, shufflePlayQueue } from '@/utils'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import { Box, Typography, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loading from '../Loading'
import { useLingui } from '@lingui/react/macro'
import useUiStore from '@/store/useUiStore'

const FolderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useLingui()
  const navigate = useNavigate()
  const { account } = useUser()
  const db = useDb(account)

  const shuffle = useUiStore.use.shuffle()
  const updateShuffle = useUiStore.use.updateShuffle()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()
  const updateAutoPlay = usePlayerStore.use.updateAutoPlay()

  const folder = useLiveQuery(
    () => id ? db?.nodes.get(id) : undefined,
    [db, id]
  )

  const songs = useLiveQuery(
    () => {
      if (id && db) {
        return db.nodes.where('parentId').equals(id).filter(item => isAudio(item.name) || isVideo(item.name)).sortBy('name')
      }
      return []
    },
    [db, id],
    []
  )

  const open = async (index: number) => {
    if (songs) {
      const list = songs.map((item, _index) => ({ track: fileNodeToTrack(item), index: _index }))
      if (shuffle) {
        updateShuffle(false)
      }
      updatePlayQueue(list)
      updateCurrentIndex(index)
      updateAutoPlay(true)
    }
  }

  const playAll = async () => {
    if (songs && songs.length > 0) {
      open(0)
    }
  }

  const shuffleAll = async () => {
    if (songs) {
      const list = songs.map((item, index) => ({ track: fileNodeToTrack(item), index }))
      if (!shuffle) {
        updateShuffle(true)
      }
      const shuffledList = shufflePlayQueue(list) || []
      updatePlayQueue(shuffledList)
      updateCurrentIndex(shuffledList[0]?.index ?? 0)
      updateAutoPlay(true)
    }
  }

  if (!songs || !folder) {
    return <Loading />
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/library/folders')}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{folder.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t`${songs.length} songs`}
          </Typography>
        </Box>
      </Box>
      <CommonList
        display="list"
        listData={songs}
        listType="files"
        func={{
          open,
          playAll,
          shuffleAll,
        }}
      />
    </Box>
  )
}

export default FolderDetail