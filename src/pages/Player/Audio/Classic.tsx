import usePlayerControl from '@/hooks/player/usePlayerControl'
import useFullscreen from '@/hooks/ui/useFullscreen'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { timeShift } from '@/utils'
import { CloseFullscreen, FastForward, FastRewind, KeyboardArrowDownOutlined, OpenInFull, PanoramaOutlined, PauseCircleOutlined, PlayCircleOutlined, QueueMusicOutlined, Repeat, RepeatOne, Shuffle, SkipNext, SkipPrevious } from '@mui/icons-material'
import { Container, Box, IconButton, Typography, Slider, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import MenuButton from './MenuButton'

const Classic = ({ player }: { player: HTMLVideoElement | null }) => {

  const [playQueue] = usePlayQueueStore((state) => [state.playQueue])

  const [
    fullscreen,
    backgroundIsShow,
    shuffle,
    repeat,
    color,
    updateAudioViewIsShow,
    updatePlayQueueIsShow,
    updateBackgroundIsShow,
    updateShuffle,
  ] = useUiStore(
    (state) => [
      state.fullscreen,
      state.backgroundIsShow,
      state.shuffle,
      state.repeat,
      state.color,
      state.updateAudioViewIsShow,
      state.updatePlayQueueIsShow,
      state.updateBackgroundIsShow,
      state.updateShuffle,
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

  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      sx={{
        width: '100%',
        height: '100dvh',
        background:
          (!backgroundIsShow || cover === './cover.webp')
            ? `linear-gradient(rgba(50, 50, 50, 0.6), ${color}bb), #000`
            : `linear-gradient(rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3) ), url(${cover})  no-repeat center, #000`,
        backgroundSize: 'cover',
        color: '#fff',
        overflow: 'hidden',
        '.MuiSvgIcon-root': {
          color: '#fff',
        },
      }}
    >
      <Box sx={{ backdropFilter: (!backgroundIsShow || cover === './cover.webp') ? '' : 'blur(30px)' }}>
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
                <KeyboardArrowDownOutlined />
              </IconButton>
            </Grid>

            <Grid xs={6} pr={{ xs: 1, sm: 0 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                aria-label="PlayQueue"
                onClick={() => updatePlayQueueIsShow(true)}
                className='app-region-no-drag'
              >
                <QueueMusicOutlined />
              </IconButton>
              <IconButton
                aria-label="NoBackground"
                onClick={() => updateBackgroundIsShow(!backgroundIsShow)}
                className='app-region-no-drag'
              >
                <PanoramaOutlined style={!backgroundIsShow ? { color: '#aaa' } : {}} />
              </IconButton>
              <IconButton
                aria-label="Full"
                onClick={() => handleClickFullscreen()}
                className='app-region-no-drag'
              >
                {
                  fullscreen
                    ? <CloseFullscreen style={{ height: 20, width: 20 }} />
                    : <OpenInFull style={{ height: 20, width: 20 }} />
                }
              </IconButton>
              <MenuButton />
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
              >
                <img
                  src={cover}
                  alt='Cover'
                  style={{
                    height: '100%',
                    maxHeight: '70dvh',
                    width: '100%',
                    objectFit: 'contain',
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
                    <Shuffle sx={{ height: 28, width: 28 }} style={(shuffle) ? { color: '#fff' } : { color: '#ccc' }} />
                  </IconButton>
                  <IconButton aria-label="previous" onClick={() => handleClickPrev()} >
                    <SkipPrevious sx={{ height: 48, width: 48 }} />
                  </IconButton>
                  <IconButton aria-label="backward" sx={{ display: { sm: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekbackward(10)} >
                    <FastRewind sx={{ height: 32, width: 32 }} />
                  </IconButton>
                  {
                    (!isLoading && playStatu === 'paused') &&
                    <IconButton aria-label="play" onClick={() => handleClickPlay()}>
                      <PlayCircleOutlined sx={{ height: 64, width: 64 }} />
                    </IconButton>
                  }
                  {
                    (!isLoading && playStatu === 'playing') &&
                    <IconButton aria-label="pause" onClick={() => handleClickPause()}>
                      <PauseCircleOutlined sx={{ height: 64, width: 64 }} />
                    </IconButton>
                  }
                  {
                    isLoading &&
                    <Box sx={{ height: 80, width: 80, padding: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress color="inherit" size={54} />
                    </Box>
                  }
                  <IconButton aria-label="forward" sx={{ display: { sm: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekforward(10)} >
                    <FastForward sx={{ height: 32, width: 32 }} />
                  </IconButton>
                  <IconButton aria-label="next" onClick={handleClickNext} >
                    <SkipNext sx={{ height: 48, width: 48 }} />
                  </IconButton>
                  <IconButton aria-label="repeat" onClick={() => handleClickRepeat()} >
                    {
                      (repeat === 'one')
                        ? <RepeatOne sx={{ height: 28, width: 28 }} />
                        : <Repeat sx={{ height: 28, width: 28 }} style={(repeat === 'off') ? { color: '#ccc' } : {}} />
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

export default Classic