import usePlayerControl from '@/hooks/player/usePlayerControl'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { Box, CircularProgress, Container, IconButton, Slider, Typography, useTheme } from '@mui/material'
import MenuButton from './MenuButton'
import { FastForward, FastRewind, KeyboardArrowDown, PauseCircleOutlined, PlayCircleOutlined, QueueMusic, Repeat, RepeatOne, Shuffle, SkipNext, SkipPrevious } from '@mui/icons-material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { animated, useSpring } from '@react-spring/web'
import { useMemo } from 'react'
import { timeShift } from '@/utils'

const Modern = ({ player }: { player: HTMLVideoElement | null }) => {

  const theme = useTheme()

  const [playQueue] = usePlayQueueStore((state) => [state.playQueue])

  const [
    shuffle,
    repeat,
    color,
    updateAudioViewIsShow,
    updatePlayQueueIsShow,
    updateShuffle,
  ] = useUiStore(
    (state) => [
      state.shuffle,
      state.repeat,
      state.color,
      state.updateAudioViewIsShow,
      state.updatePlayQueueIsShow,
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

  const [{ background }, api] = useSpring(
    () => ({
      background: `linear-gradient(180deg, ${color}33, ${color}15, ${color}05), ${theme.palette.background.default}`,
    })
  )
  useMemo(
    () => api.start({
      background: `linear-gradient(180deg, ${color}33, ${color}15, ${color}05), ${theme.palette.background.default}`
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, theme.palette.background.default]
  )

  return (
    <animated.div
      style={{
        width: '100%',
        height: '100%',
        background: background,
      }}
    >
      <Container
        maxWidth={'xl'}
        disableGutters={true}
        className='pt-titlebar-area-height'
        sx={{
          height: '100%',
        }}
      >

        <Grid
          container
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            flexGrow: 1,
            flexWrap: 'nowrap',
            gap: '1rem',
            width: '100%',
            height: '100%',
            padding: '1rem',
          }}
        >

          <Grid
            container
            sx={{
              flexDirection: { xs: 'row', sm: 'column' },
              justifyContent: { xs: 'space-between', sm: 'flex-start' },
              width: { xs: '100%', sm: 'auto' },
              height: { xs: 'auto', sm: '100%' },
              gap: '1rem',
            }}>
            <IconButton aria-label="close" onClick={() => updateAudioViewIsShow(false)}>
              <KeyboardArrowDown />
            </IconButton>

            <MenuButton />
          </Grid>

          <Grid
            container
            sx={{
              flexGrow: 1,
              width: { xs: '100%', sm: 0 },
              height: { xs: 0, sm: '100%' },
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ aspectRatio: '1/1', maxWidth: '100%', maxHeight: '100%' }}>
              <img
                src={cover}
                alt='Cover'
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: { xs: 0, sm: 1 },
              width: { xs: '100%', sm: 0 },
              height: { xs: 'auto', sm: '100%' },
              justifyContent: 'flex-end',
            }}
          >
            <Box sx={{ width: '100%', textOverflow: 'ellipsis' }}>
              <Typography variant="h5" component="div" noWrap>
                {(!playQueue || !currentMetaData) ? 'Not playing' : currentMetaData.title}
              </Typography>
              <Typography variant="subtitle2" component="div" noWrap>
                {(playQueue && currentMetaData) && currentMetaData.artist}
              </Typography>
              <Typography variant="subtitle1" component="div" noWrap>
                {(playQueue && currentMetaData) && currentMetaData.album}
              </Typography>
            </Box>

            <Slider
              size="small"
              min={0}
              max={1000}
              value={(!duration) ? 0 : currentTime / duration * 1000}
              onChange={(_, current) => handleTimeRangeonChange(current)}
              style={{ width: '100%', color: color }}
            />
            <Typography sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
              <span>{timeShift(currentTime)}</span>
              <span>{timeShift((duration) ? duration : 0)}</span>
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                wrap: 'nowrap',
                width: '100%'
              }}
            >
              <IconButton aria-label="shuffle" onClick={() => updateShuffle(!shuffle)}>
                <Shuffle sx={{ height: 28, width: 28 }} style={(shuffle) ? {} : { color: theme.palette.divider }} />
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
                    : <Repeat sx={{ height: 28, width: 28 }} style={(repeat === 'off') ? { color: theme.palette.divider } : {}} />
                }
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
              <IconButton
                aria-label="PlayQueue"
                onClick={() => updatePlayQueueIsShow(true)}
                className='app-region-no-drag'
              >
                <QueueMusic />
              </IconButton>
            </Box>

          </Box>
        </Grid>

      </Container>
    </animated.div>
  )
}

export default Modern