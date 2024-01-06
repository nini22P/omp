import { Box, CircularProgress, Container, IconButton, Slider, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import useFullscreen from '@/hooks/ui/useFullscreen'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
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
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded'
import { SpringValue, animated, useSpring } from '@react-spring/web'
import { useMemo } from 'react'
import usePlayerControl from '@/hooks/player/usePlayerControl'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import MenuButton from './MenuButton'
import { timeShift } from '@/utils'

const Modern = ({ player, styles }: { player: HTMLVideoElement | null, styles: { borderRadius: SpringValue<string> } }) => {

  const theme = useTheme()

  const [playQueue] = usePlayQueueStore((state) => [state.playQueue])

  const [
    fullscreen,
    shuffle,
    repeat,
    coverColor,
    updateAudioViewIsShow,
    updatePlayQueueIsShow,
  ] = useUiStore(
    (state) => [
      state.fullscreen,
      state.shuffle,
      state.repeat,
      state.coverColor,
      state.updateAudioViewIsShow,
      state.updatePlayQueueIsShow,
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
    handleClickShuffle,
    handleClickRepeat,
  } = usePlayerControl(player)

  const { handleClickFullscreen } = useFullscreen()

  const [{ background }, api] = useSpring(
    () => ({
      background: `linear-gradient(180deg, ${coverColor}33, ${coverColor}15, ${coverColor}05), ${theme.palette.background.default}`,
    })
  )
  useMemo(
    () => api.start({
      background: `linear-gradient(180deg, ${coverColor}33, ${coverColor}15, ${coverColor}05), ${theme.palette.background.default}`
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coverColor, theme.palette.background.default]
  )

  return (
    <animated.div
      style={{
        width: '100%',
        height: '100%',
        background: background,
        ...styles,
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
            flexDirection: 'column',
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
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              height: 'auto',
            }}>
            <IconButton aria-label="close" onClick={() => updateAudioViewIsShow(false)}>
              <KeyboardArrowDownRoundedIcon />
            </IconButton>
            <Grid
              container
              sx={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <IconButton
                aria-label="PlayQueue"
                onClick={() => updatePlayQueueIsShow(true)}
                className='app-region-no-drag'
              >
                <QueueMusicRoundedIcon />
              </IconButton>

              <IconButton
                aria-label="Full"
                onClick={() => handleClickFullscreen()}
                className='app-region-no-drag'
              >
                {
                  fullscreen
                    ? <CloseFullscreenRoundedIcon style={{ height: 20, width: 20 }} />
                    : <OpenInFullRoundedIcon style={{ height: 20, width: 20 }} />
                }
              </IconButton>

              <MenuButton />
            </Grid>
          </Grid>

          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'fit-content(40%) 1fr' },
              gridTemplateRows: { xs: '1fr 1fr', sm: '1fr' },
              // gap: { xs: '0', sm: '1rem' },
              alignItems: 'center',
            }}
          >

            <Box
              sx={{
                aspectRatio: '1/1',
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'hidden',
                padding: '1rem',
              }}>
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
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                overflow: 'hidden',
                padding: '1rem',
                paddingBottom: '0',
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
                sx={{
                  width: '100%',
                  height: '0.25rem',
                }}
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
                <IconButton aria-label="shuffle" onClick={() => handleClickShuffle()}>
                  <ShuffleRoundedIcon sx={{ height: 28, width: 28 }} style={(shuffle) ? {} : { color: '#aaa' }} />
                </IconButton>
                <IconButton aria-label="previous" onClick={() => handleClickPrev()} >
                  <SkipPreviousRoundedIcon sx={{ height: 48, width: 48 }} />
                </IconButton>
                <IconButton aria-label="backward" sx={{ display: { md: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekbackward(10)} >
                  <FastRewindRoundedIcon sx={{ height: 32, width: 32 }} />
                </IconButton>
                {
                  (!isLoading && playStatu === 'paused') &&
                  <IconButton aria-label="play" onClick={() => handleClickPlay()}>
                    <PlayCircleOutlineRoundedIcon sx={{ height: 64, width: 64 }} />
                  </IconButton>
                }
                {
                  (!isLoading && playStatu === 'playing') &&
                  <IconButton aria-label="pause" onClick={() => handleClickPause()}>
                    <PauseCircleOutlineRoundedIcon sx={{ height: 64, width: 64 }} />
                  </IconButton>
                }
                {
                  isLoading &&
                  <Box sx={{ height: 80, width: 80, padding: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress color="inherit" size={54} />
                  </Box>
                }
                <IconButton aria-label="forward" sx={{ display: { md: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekforward(10)} >
                  <FastForwardRoundedIcon sx={{ height: 32, width: 32 }} />
                </IconButton>
                <IconButton aria-label="next" onClick={handleClickNext} >
                  <SkipNextRoundedIcon sx={{ height: 48, width: 48 }} />
                </IconButton>
                <IconButton aria-label="repeat" onClick={() => handleClickRepeat()} >
                  {
                    (repeat === 'one')
                      ? <RepeatOneRoundedIcon sx={{ height: 28, width: 28 }} />
                      : <RepeatRoundedIcon sx={{ height: 28, width: 28 }} style={(repeat === 'off') ? { color: '#aaa' } : {}} />
                  }
                </IconButton>
              </Box>

            </Box>
          </Box>

        </Grid>

      </Container>
    </animated.div>
  )
}

export default Modern