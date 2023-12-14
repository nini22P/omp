import { useEffect, useRef } from 'react'
import { Box, Container, IconButton, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import useControlHide from '@/hooks/useControlHide'
import useMediaSession from '@/hooks/useMediaSession'
import usePlayer from '@/hooks/usePlayer'
import useTheme from '@/hooks/useTheme'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
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

  const [type] = usePlayQueueStore((state) => [state.type])

  const [
    videoViewIsShow,
    controlIsShow,
    updateVideoViewIsShow,
    updateControlIsShow,
    updateFullscreen,
  ] = useUiStore(
    (state) => [
      state.videoViewIsShow,
      state.controlIsShow,
      state.updateVideoViewIsShow,
      state.updateControlIsShow,
      state.updateFullscreen,
    ]
  )

  const playerRef = useRef<HTMLVideoElement>(null)
  const player = playerRef.current   // 声明播放器对象

  const {
    url,
    onEnded,
    seekTo,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
    handleTimeRangeonChange,
    handleClickRepeat,
  } = usePlayer(player)

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
    seekTo
  )

  // 播放视频时自动隐藏ui
  useControlHide(type, videoViewIsShow)

  // 检测全屏
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  })

  const handleClickFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'top 0.35s' }}
        style={(videoViewIsShow) ? { top: '0' } : { top: '100vh' }}
      >
        <Grid container
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'start',
            backgroundColor: '#000'
          }}
        >
          <Grid xs={12} sx={{ width: '100%', height: '100%' }}>
            <video
              width={'100%'}
              height={'100%'}
              src={url}
              // autoPlay
              ref={playerRef}
              onEnded={() => onEnded()}
              onDoubleClick={() => handleClickFullscreen()}
            />
          </Grid>

          {/* 视频播放顶栏 */}
          <Grid xs={12}
            position={'absolute'}
            sx={controlIsShow ? { top: 0, left: 0, borderRadius: '0 0 5px 0', width: 'auto' } : { display: 'none' }}
            className='pt-titlebar-area-height'
          >
            <IconButton
              aria-label="close"
              onClick={() => {
                updateVideoViewIsShow(false)
                updateControlIsShow(true)
              }}
              className='app-region-no-drag'
            >
              <KeyboardArrowDownOutlinedIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Grid>

        </Grid>

      </Container>
      <Paper
        elevation={0}
        square={true}
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: `0px -2px 2px -1px ${styles.color.shadow}` }}
      // style={(videoViewIsShow) ? { backgroundColor: '#ffffffee' } : { backgroundColor: '#ffffff' }}
      >
        <Container maxWidth={false} disableGutters={true}>
          <Box sx={(controlIsShow) ? {} : { display: 'none' }}>
            <PlayerControl
              metaData={currentMetaData}
              handleClickPlay={handleClickPlay}
              handleClickPause={handleClickPause}
              handleClickNext={handleClickNext}
              handleClickPrev={handleClickPrev}
              handleClickSeekforward={handleClickSeekforward}
              handleClickSeekbackward={handleClickSeekbackward}
              handleTimeRangeonChange={handleTimeRangeonChange}
              handleClickRepeat={handleClickRepeat}
              handleClickFullscreen={handleClickFullscreen}
            />
          </Box>
          <Audio
            metaData={currentMetaData}
            handleClickPlay={handleClickPlay}
            handleClickPause={handleClickPause}
            handleClickNext={handleClickNext}
            handleClickPrev={handleClickPrev}
            handleClickSeekforward={handleClickSeekforward}
            handleClickSeekbackward={handleClickSeekbackward}
            handleTimeRangeonChange={handleTimeRangeonChange}
            handleClickRepeat={handleClickRepeat}
            handleClickFullscreen={handleClickFullscreen}
          />
          <PlayQueue />
        </Container>
      </Paper >
    </div>
  )
}

export default Player