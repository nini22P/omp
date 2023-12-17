import { useRef } from 'react'
import { Box, Container } from '@mui/material'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useMediaSession from '@/hooks/player/useMediaSession'
import usePlayerCore from '@/hooks/player/usePlayerCore'
import usePlayerControl from '@/hooks/player/usePlayerControl'
import useTheme from '@/hooks/ui/useTheme'
import useControlHide from '@/hooks/ui/useControlHide'
import VideoPlayer from './VideoPlayer'
import Audio from './Audio/Audio'
import PlayerControl from './PlayerControl'
import PlayQueue from './PlayQueue'

const Player = () => {

  const { styles } = useTheme()

  const [
    currentMetaData,
    cover,
  ] = usePlayerStore(
    (state) => [
      state.currentMetaData,
      state.cover,
    ]
  )

  const [
    videoViewIsShow,
    controlIsShow,
  ] = useUiStore(
    (state) => [
      state.videoViewIsShow,
      state.controlIsShow,
    ]
  )

  const playerRef = useRef<HTMLVideoElement>(null)
  const player = playerRef.current   // 声明播放器对象

  const {
    url,
    onEnded,
  } = usePlayerCore(player)

  const {
    seekTo,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
  } = usePlayerControl(player)

  // 向 mediaSession 发送当前播放进度
  useMediaSession(
    player,
    cover,
    currentMetaData?.album,
    currentMetaData?.artist,
    currentMetaData?.title,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekbackward,
    handleClickSeekforward,
    seekTo,
  )

  const [type] = usePlayQueueStore((state) => [state.type])

  // 播放视频时自动隐藏ui
  useControlHide(type, videoViewIsShow)

  return (
    <div>
      <VideoPlayer url={url} onEnded={onEnded} ref={playerRef} />
      <Box
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: `0px -2px 2px -1px ${styles.color.shadow}` }}
      // style={(videoViewIsShow) ? { backgroundColor: '#ffffffee' } : { backgroundColor: '#ffffff' }}
      >
        <Container maxWidth={false} disableGutters={true}>
          <Box sx={(controlIsShow) ? {} : { display: 'none' }}>
            <PlayerControl player={player} />
          </Box>
          <Audio player={player} />
          <PlayQueue />
        </Container>
      </Box >
    </div>
  )
}

export default Player