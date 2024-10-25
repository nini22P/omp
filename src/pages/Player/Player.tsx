import { useRef } from 'react'
import { Box } from '@mui/material'
import useUiStore from '@/store/useUiStore'
import useMediaSession from '@/hooks/player/useMediaSession'
import usePlayerCore from '@/hooks/player/usePlayerCore'
import VideoPlayer from './VideoPlayer'
import Audio from './Audio/Audio'
import PlayerControl from './PlayerControl'
import PlayQueue from './PlayQueue'
import VideoPlayerTopbar from './VideoPlayerTopbar'

const Player = () => {

  const controlIsShow = useUiStore((state) => state.controlIsShow)

  const playerRef = useRef<HTMLVideoElement>(null)
  const player = playerRef.current   // 声明播放器对象

  const { url, onEnded } = usePlayerCore(player)

  // 向 mediaSession 发送当前播放进度
  useMediaSession(player)

  return (
    <>
      <VideoPlayer url={url} onEnded={onEnded} ref={playerRef} />
      <VideoPlayerTopbar />
      <Box
        sx={{
          position: 'fixed',
          padding: '0 0.5rem 0.5rem 0.5rem',
          transform: controlIsShow ? 'none' : 'translateY(8rem)',
          transition: 'all 0.2s ease-out',
          bottom: 0,
          width: '100%',
        }}
      >
        <PlayerControl player={player} />
      </Box>
      <Audio player={player} />
      <PlayQueue />
    </>
  )
}

export default Player