import { useRef } from 'react'
import { Box, Container } from '@mui/material'
import useUiStore from '@/store/useUiStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useMediaSession from '@/hooks/player/useMediaSession'
import usePlayerCore from '@/hooks/player/usePlayerCore'
import useControlHide from '@/hooks/ui/useControlHide'
import VideoPlayer from './VideoPlayer'
import Audio from './Audio/Audio'
import PlayerControl from './PlayerControl'
import PlayQueue from './PlayQueue'

const Player = () => {


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

  // 向 mediaSession 发送当前播放进度
  useMediaSession(player)

  const [type] = usePlayQueueStore((state) => [state.type])

  // 播放视频时自动隐藏ui
  useControlHide(type, videoViewIsShow)

  return (
    <div>
      <VideoPlayer url={url} onEnded={onEnded} ref={playerRef} />
      <Box sx={{ position: 'fixed', bottom: '0', width: '100%' }}>
        <Container maxWidth={'xl'} disableGutters>
          <Box
            sx={{
              padding: '0 0.5rem 0.5rem 0.5rem',
              visibility: controlIsShow ? 'visible' : 'hidden',
            }}
          >
            <PlayerControl player={player} />
          </Box>
          <Audio player={player} />
          <PlayQueue />
        </Container>
      </Box>
    </div>
  )
}

export default Player