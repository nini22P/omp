import { Box, CircularProgress, Container, IconButton, Slider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import PanoramaOutlinedIcon from '@mui/icons-material/PanoramaOutlined'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import useFullscreen from '@/hooks/ui/useFullscreen'
import usePlayerControl from '@/hooks/player/usePlayerControl'
import { timeShift } from '@/utils'
import { useMemo } from 'react'
import { extractColors } from 'extract-colors'

const Audio = ({ player }: { player: HTMLVideoElement | null }) => {

  const [playQueue] = usePlayQueueStore((state) => [state.playQueue])

  const [
    audioViewIsShow,
    fullscreen,
    backgroundIsShow,
    shuffle,
    repeat,
    color,
    updateAudioViewIsShow,
    updatePlayQueueIsShow,
    updateBackgroundIsShow,
    updateShuffle,
    updateColor,
  ] = useUiStore(
    (state) => [
      state.audioViewIsShow,
      state.fullscreen,
      state.backgroundIsShow,
      state.shuffle,
      state.repeat,
      state.color,
      state.updateAudioViewIsShow,
      state.updatePlayQueueIsShow,
      state.updateBackgroundIsShow,
      state.updateShuffle,
      state.updateColor,
    ]
  )

  const [
    currentMetaData,
    playStatu,
    isLoading,
    cover,
    currentTime,
    duration
  ] = usePlayerStore(
    (state) => [
      state.currentMetaData,
      state.playStatu,
      state.isLoading,
      state.cover,
      state.currentTime,
      state.duration,
    ]
  )

  const {
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
    handleTimeRangeonChange,
    handleClickRepeat,
  } = usePlayerControl(player)

  const { handleClickFullscreen } = useFullscreen()

  // 从专辑封面提取颜色
  useMemo(
    () => (cover !== './cover.png')
      && extractColors(cover).then(color => updateColor(color[0].hex)).catch(console.error),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cover]
  )

  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      sx={{
        width: '100%',
        height: '100dvh',
        position: 'fixed',
        transition: 'top 0.35s ease-in-out',
        transform: 'translateZ(0)',
        background:
          (!backgroundIsShow || cover === './cover.png')
            ? `linear-gradient(rgba(50, 50, 50, 0.6), ${color}bb), #000`
            : `linear-gradient(rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3) ), url(${cover})  no-repeat center, #000`,
        backgroundSize: 'cover',
        color: '#fff',
        overflow: 'hidden',
        '.MuiSvgIcon-root': {
          color: '#fff',
        },
      }}
      style={(audioViewIsShow) ? { top: 0 } : { top: '100vh' }}
    >
      <Box sx={{ backdropFilter: (!backgroundIsShow || cover === './cover.png') ? '' : 'blur(30px)' }}>
        <Container
          maxWidth={'xl'}
          disableGutters={true}
          className='pt-titlebar-area-height'
        >
          <Grid container
            pt={{ xs: 1, sm: 2 }}
            pb={{ xs: 1, sm: 2 }}
            pl={{ xs: 0, sm: 2 }}
            pr={{ xs: 0, sm: 2 }}
            sx={{
              width: '100%',
              height: '100dvh',
              justifyContent: 'space-evenly',
              alignItems: 'start',
            }}
          >
            <Grid xs={6} pl={{ xs: 1, sm: 0 }} >
              <IconButton
                aria-label="close"
                onClick={() => updateAudioViewIsShow(false)}
                className='app-region-no-drag'
              >
                <KeyboardArrowDownOutlinedIcon />
              </IconButton>
            </Grid>

            <Grid xs={6} pr={{ xs: 1, sm: 0 }} textAlign={'right'}>
              <IconButton
                aria-label="PlayQueue"
                onClick={() => updatePlayQueueIsShow(true)}
                className='app-region-no-drag'
              >
                <QueueMusicOutlinedIcon />
              </IconButton>
              <IconButton
                aria-label="NoBackground"
                onClick={() => updateBackgroundIsShow(!backgroundIsShow)}
                className='app-region-no-drag'
              >
                <PanoramaOutlinedIcon style={!backgroundIsShow ? { color: '#aaa' } : {}} />
              </IconButton>
              <IconButton
                aria-label="Full"
                onClick={() => handleClickFullscreen()}
                className='app-region-no-drag'
              >
                {
                  fullscreen
                    ? <CloseFullscreenIcon style={{ height: 20, width: 20 }} />
                    : <OpenInFullIcon style={{ height: 20, width: 20 }} />
                }
              </IconButton>
            </Grid>

            {/* 封面和音频信息 */}
            <Grid container
              xs={12}
              maxWidth={'lg'}
              height={{ xs: 'calc(100dvh - 4rem - env(titlebar-area-height, 0px))', sm: 'auto' }}
              flexDirection={{ xs: 'column', sm: 'row' }}
              wrap='nowrap'
              justifyContent={{ xs: 'end', sm: 'space-evenly' }}
              alignItems={'center'}
              pl={{ xs: 0, sm: 1 }}
              pr={{ xs: 0, sm: 1 }}
              pb={{ xs: 3, sm: 0 }}
              gap={{ xs: 3, sm: 3 }}
            >
              {/* 封面 */}
              <Grid
                container
                xs={12}
                sm={4}
                flexGrow={1}
                justifyContent={'center'}
                alignItems={'center'}
                overflow={'hidden'}
                sx={{ objectFit: 'cover' }}
              >
                <img
                  src={cover}
                  alt='Cover'
                  style={{
                    height: '100%',
                    maxHeight: '100vw',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Grid>

              {/* 音频信息 */}
              <Grid xs={12} sm={8} pl={{ xs: 0, lg: 5 }} textAlign={'center'}>
                <Grid xs={12} pl={4} pr={4} >
                  <Typography variant="h6" component="div" textAlign={'center'} noWrap>
                    {(!playQueue || !currentMetaData) ? 'Not playing' : currentMetaData.title}
                  </Typography>
                  <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                    {(playQueue && currentMetaData) && currentMetaData.artist}
                  </Typography>
                  <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                    {(playQueue && currentMetaData) && currentMetaData.album}
                  </Typography>
                </Grid>

                {/* 播放进度条 */}
                <Grid xs={12} pl={{ xs: 3, sm: 0 }} pr={{ xs: 3, sm: 0 }} >
                  <Slider
                    size="small"
                    min={0}
                    max={1000}
                    value={(!duration) ? 0 : currentTime / duration * 1000}
                    onChange={(_, current) => handleTimeRangeonChange(current)}
                    style={{ color: '#fff', width: '100%' }}
                  />
                  <Typography style={{ color: '#fff' }} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                    <span>{timeShift(currentTime)}</span>
                    <span>{timeShift((duration) ? duration : 0)}</span>
                  </Typography>
                </Grid>

                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', wrap: 'nowrap' }}>
                  <IconButton aria-label="shuffle" onClick={() => updateShuffle(!shuffle)}>
                    <ShuffleIcon sx={{ height: 28, width: 28 }} style={(shuffle) ? { color: '#fff' } : { color: '#ccc' }} />
                  </IconButton>
                  <IconButton aria-label="previous" onClick={() => handleClickPrev()} >
                    <SkipPreviousIcon sx={{ height: 48, width: 48 }} />
                  </IconButton>
                  <IconButton aria-label="backward" sx={{ display: { sm: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekbackward(10)} >
                    <FastRewindIcon sx={{ height: 32, width: 32 }} />
                  </IconButton>
                  {
                    (!isLoading && playStatu === 'paused') &&
                    <IconButton aria-label="play" onClick={() => handleClickPlay()}>
                      <PlayCircleOutlinedIcon sx={{ height: 64, width: 64 }} />
                    </IconButton>
                  }
                  {
                    (!isLoading && playStatu === 'playing') &&
                    <IconButton aria-label="pause" onClick={() => handleClickPause()}>
                      <PauseCircleOutlinedIcon sx={{ height: 64, width: 64 }} />
                    </IconButton>
                  }
                  {
                    isLoading &&
                    <Box sx={{ height: 80, width: 80, padding: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress color="inherit" size={54} />
                    </Box>
                  }
                  <IconButton aria-label="forward" sx={{ display: { sm: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekforward(10)} >
                    <FastForwardIcon sx={{ height: 32, width: 32 }} />
                  </IconButton>
                  <IconButton aria-label="next" onClick={handleClickNext} >
                    <SkipNextIcon sx={{ height: 48, width: 48 }} />
                  </IconButton>
                  <IconButton aria-label="repeat" onClick={() => handleClickRepeat()} >
                    {
                      (repeat === 'one')
                        ? <RepeatOneIcon sx={{ height: 28, width: 28 }} />
                        : <RepeatIcon sx={{ height: 28, width: 28 }} style={(repeat === 'off') ? { color: '#ccc' } : {}} />
                    }

                  </IconButton>
                </Grid>

              </Grid>
            </Grid>

          </Grid>
        </Container>
      </Box>

    </Container>
  )
}

export default Audio