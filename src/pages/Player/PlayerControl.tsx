import { Box, ButtonBase, CircularProgress, Container, IconButton, Paper, Slider, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded'
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded'
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import RepeatOneRoundedIcon from '@mui/icons-material/RepeatOneRounded'
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded'
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import useFullscreen from '@/hooks/ui/useFullscreen'
import usePlayerControl from '@/hooks/player/usePlayerControl'
import { checkFileType, timeShift } from '@/utils'
import PlayerMenu from './PlayerMenu'
import VolumeControl from './VolumeControl'
import { useEffect, useMemo } from 'react'
import useControlHide from '@/hooks/ui/useControlHide'
import { useShallow } from 'zustand/shallow'

const PlayerControl = ({ player }: { player: HTMLVideoElement | null }) => {

  const theme = useTheme()

  const iconStyles = {
    small: { width: 20, height: 20 },
    large: { width: 38, height: 38 }
  }

  const [currentIndex, playQueue] = usePlayQueueStore(
    useShallow((state) => [state.currentIndex, state.playQueue])
  )

  const [
    audioViewIsShow,
    videoViewIsShow,
    playQueueIsShow,
    fullscreen,
    shuffle,
    repeat,
    updateAudioViewIsShow,
    updateVideoViewIsShow,
    updatePlayQueueIsShow,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.audioViewIsShow,
        state.videoViewIsShow,
        state.playQueueIsShow,
        state.fullscreen,
        state.shuffle,
        state.repeat,
        state.updateAudioViewIsShow,
        state.updateVideoViewIsShow,
        state.updatePlayQueueIsShow,
      ]
    )
  )

  const [
    currentMetaData,
    playStatu,
    isLoading,
    cover,
    currentTime,
    duration,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.currentMetaData,
        state.playStatu,
        state.isLoading,
        state.cover,
        state.currentTime,
        state.duration,
      ]
    )
  )

  const {
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
    handleTimeRangeonChange,
    handleClickShuffle,
    handleClickRepeat,
  } = usePlayerControl(player)

  const { handleClickFullscreen } = useFullscreen()

  const currentFile = playQueue?.find(item => item.index === currentIndex)
  const type = useMemo(() => currentFile && checkFileType(currentFile.fileName) === 'video' ? 'video' : 'audio', [currentFile])

  const handleClickMediaInfo = () => {
    if (type === 'audio')
      updateAudioViewIsShow(true)
    if (type === 'video')
      updateVideoViewIsShow(!videoViewIsShow)
  }

  useControlHide(type || 'audio')  // 播放视频时自动隐藏ui

  // 根据格式自动切换
  useEffect(
    () => {
      if (type === 'audio' && videoViewIsShow) {
        updateVideoViewIsShow(false)
        updateAudioViewIsShow(true)
      }
      if (type === 'video' && audioViewIsShow) {
        updateAudioViewIsShow(false)
        updateVideoViewIsShow(true)
      }
    },
    [audioViewIsShow, type, updateAudioViewIsShow, updateVideoViewIsShow, videoViewIsShow]
  )

  return (
    <Container maxWidth={'xl'} disableGutters={true}>
      <Paper
        sx={{
          backgroundColor: `${theme.palette.background.paper}99`,
          backdropFilter: 'blur(16px)',
          width: '100%',
        }}
      >
        <Grid container
          sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', }}
        >
          {/* 播放进度 */}
          {/* <Grid xs={12}> */}
          <Grid
            container
            size={12}
            pl={{ xs: 0, sm: 1 }}
            pr={{ xs: 0, sm: 1 }}
            sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
            <Grid
              size='auto'
              sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
            >
              <Typography
                component='div'
                color='text.secondary'
              >
                {timeShift(currentTime)}
              </Typography>
            </Grid >
            <Grid
              size='grow'
              pl={{ xs: 1, sm: 2 }}
              pr={{ xs: 1, sm: 2 }}
            >
              <Slider
                size='small'
                min={0}
                max={1000}
                value={(!duration) ? 0 : currentTime / duration * 1000}
                onChange={(_, current) => handleTimeRangeonChange(current)}
                sx={{
                  padding: '12px 0 !important',
                  height: '0.25rem',
                }}
              />
            </Grid>
            <Grid
              size='auto'
              sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
            >
              <Typography
                component='div'
                color='text.secondary'
              >
                {timeShift((duration) ? duration : 0)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container size={12} wrap={'nowrap'} sx={{ alignItems: 'center' }} >
            {/* 媒体信息 */}
            <Grid
              container
              size='grow'
              textAlign={'left'}
              minWidth={0}
            >
              <ButtonBase
                sx={{ height: '4rem', width: '100%', borderRadius: '0.5rem' }}
                onClick={() => handleClickMediaInfo()}>
                <Grid size='grow' container sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', overflow: 'hidden', flexGrow: 'nowrap' }}>
                  <Grid size="auto" sx={{ width: '4rem', height: '4rem', padding: '0.5rem', display: type === 'video' ? 'none' : 'flex' }}>
                    {
                      (type === 'audio') &&
                      <img
                        src={cover}
                        alt='Cover'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                        }}
                      />
                    }
                  </Grid>
                  <Grid size='grow' sx={{ pl: 1 }} minWidth={0}>
                    <Typography variant="body1" component="div" noWrap>
                      {(!playQueue || !currentMetaData) ? 'Not playing' : currentMetaData.title}
                    </Typography>
                    <div>
                      {
                        (!playQueue || !currentMetaData) ||
                        <Typography variant="subtitle1" color="text.secondary" component="div" noWrap>
                          {currentMetaData.artist && currentMetaData.artist}{currentMetaData.album && ` • ${currentMetaData.album}`}
                        </Typography>
                      }
                    </div>
                  </Grid>
                </Grid>
              </ButtonBase>
            </Grid>

            {/* 基本控制按钮 */}
            <Grid container size={{ xs: 5, sm: 'auto' }} wrap='nowrap' paddingX={{ xs: 0, sm: 1 }} sx={{ justifyContent: 'center', alignItems: 'center', }} >
              <IconButton
                sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
                aria-label="shuffle"
                onClick={() => handleClickShuffle()}
              >
                <ShuffleRoundedIcon sx={iconStyles.small} style={(shuffle) ? {} : { color: '#aaa' }} />
              </IconButton>

              <IconButton aria-label="previous" onClick={handleClickPrev} >
                <SkipPreviousRoundedIcon />
              </IconButton>

              <IconButton
                sx={{ display: { md: 'inline-grid', xs: 'none' } }}
                aria-label="backward"
                onClick={() => handleClickSeekbackward(10)}
              >
                <FastRewindRoundedIcon sx={iconStyles.small} />
              </IconButton>

              {
                (!isLoading && playStatu === 'paused') &&
                <IconButton aria-label="play" onClick={() => handleClickPlay()}>
                  <PlayCircleOutlineRoundedIcon sx={iconStyles.large} />
                </IconButton>
              }
              {
                (!isLoading && playStatu === 'playing') &&
                <IconButton aria-label="pause" onClick={() => handleClickPause()}>
                  <PauseCircleOutlineRoundedIcon sx={iconStyles.large} />
                </IconButton>
              }
              {
                isLoading &&
                <Box sx={{ padding: '11px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress style={{ color: '#666' }} size={32} />
                </Box>
              }

              <IconButton
                sx={{ display: { md: 'inline-grid', xs: 'none' } }}
                aria-label="forward"
                onClick={() => handleClickSeekforward(10)}
              >
                <FastForwardRoundedIcon sx={iconStyles.small} />
              </IconButton>

              <IconButton aria-label="next" onClick={handleClickNext} >
                <SkipNextRoundedIcon />
              </IconButton>

              <IconButton
                sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
                aria-label="repeat"
                onClick={() => handleClickRepeat()}
              >
                {
                  (repeat === 'one')
                    ? <RepeatOneRoundedIcon sx={iconStyles.small} />
                    : <RepeatRoundedIcon sx={iconStyles.small} style={(repeat === 'off') ? { color: '#aaa' } : {}} />
                }
              </IconButton>
            </Grid>

            {/* 其他按钮 */}
            <Grid
              container
              size='grow'
              textAlign={'right'}
              wrap='nowrap'
              sx={{ display: { sm: 'block', xs: type === 'video' ? 'block' : 'none' } }}
              pr={1}
            >

              <IconButton onClick={() => updatePlayQueueIsShow(!playQueueIsShow)} sx={{ display: { sm: 'inline-grid', xs: 'none' } }}>
                <PlaylistPlayRoundedIcon />
              </IconButton>

              <Box sx={{ display: 'inline-grid' }}>
                <VolumeControl />
              </Box>

              <IconButton onClick={() => handleClickFullscreen()} sx={{ display: { sm: 'inline-grid', xs: 'none' } }} >
                {
                  fullscreen
                    ? <CloseFullscreenRoundedIcon sx={{ height: 18, width: 18 }} />
                    : <OpenInFullRoundedIcon sx={{ height: 18, width: 18, }} />
                }
              </IconButton>

              <Box sx={{ display: 'inline-grid' }} >
                <PlayerMenu player={player} />
              </Box>
            </Grid>

          </Grid>

        </Grid>
      </Paper>
    </Container >
  )
}

export default PlayerControl