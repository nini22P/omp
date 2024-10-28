import { Box, CircularProgress, Container, IconButton, Slider, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
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
import LyricsRoundedIcon from '@mui/icons-material/LyricsRounded'
import { SpringValue, animated, useSpring } from '@react-spring/web'
import { useMemo, useState } from 'react'
import { t } from '@lingui/macro'
import usePlayerControl from '@/hooks/player/usePlayerControl'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import PlayerMenu from '../PlayerMenu'
import { timeShift } from '@/utils'
import { useShallow } from 'zustand/shallow'
import Lyrics from '@/components/Lyrics/Lyrics'
import VolumeControl from '../VolumeControl'

const Modern = ({ player, styles }: { player: HTMLVideoElement | null, styles: { borderRadius: SpringValue<string> } }) => {

  const theme = useTheme()

  const playQueue = usePlayQueueStore.use.playQueue()

  const [
    audioViewIsShow,
    fullscreen,
    shuffle,
    repeat,
    coverColor,
    lyricsIsShow,
    updateAudioViewIsShow,
    updatePlayQueueIsShow,
    updateLyricsIsShow,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.audioViewIsShow,
        state.fullscreen,
        state.shuffle,
        state.repeat,
        state.coverColor,
        state.lyricsIsShow,
        state.updateAudioViewIsShow,
        state.updatePlayQueueIsShow,
        state.updateLyricsIsShow,
      ]
    )
  )

  const [
    currentMetaData,
    playStatu,
    isLoading,
    cover,
    currentTime,
    duration
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

  const isMobile = useMediaQuery('(max-height: 600px) or (max-width: 600px)')

  const [currentTab, setCurrentTab] = useState(0)

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

            <IconButton aria-label="close" onClick={() => updateAudioViewIsShow(!audioViewIsShow)}>
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

              {
                !isMobile &&
                <IconButton
                  aria-label="PlayQueue"
                  onClick={() => updatePlayQueueIsShow(true)}
                  className='app-region-no-drag'
                >
                  <QueueMusicRoundedIcon />
                </IconButton>
              }

              {!isMobile && <VolumeControl />}

              {
                !isMobile &&
                <IconButton
                  aria-label="Lyrics"
                  onClick={() => updateLyricsIsShow(!lyricsIsShow)}
                  className='app-region-no-drag'
                >
                  <LyricsRoundedIcon
                    style={
                      lyricsIsShow
                        ? { height: 20, width: 20 }
                        : { height: 20, width: 20, color: '#aaa' }
                    }
                  />
                </IconButton>
              }

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

              <PlayerMenu player={player} />
            </Grid>
          </Grid>

          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '2fr 3fr' },
              gridTemplateRows: { xs: '1fr 1fr auto', sm: '1fr' },
              // gap: { xs: '0', sm: '1rem' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >

            {/* 封面 */}
            <Box
              sx={{
                aspectRatio: '1/1',
                maxWidth: '100%',
                maxHeight: '100%',
                minHeight: '5rem',
                minWidth: '5rem',
                overflow: 'hidden',
                padding: '1rem',
                gridRow: { xs: '1', sm: isMobile ? '1 / 3' : '1' },
                zIndex: 1,
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

            {/* 歌词 */}
            {
              ((!isMobile && lyricsIsShow) || (isMobile && currentTab === 1)) &&
              <Box
                sx={{
                  gridRow: { xs: 'auto', sm: isMobile ? 'auto' : '1 / 3' },
                  overflow: 'hidden',
                  height: '100%',
                  padding: '1rem',
                  pointerEvents: 'none',
                }}
              >
                {
                  currentMetaData && currentMetaData.lyrics
                    ? <Lyrics lyrics={currentMetaData.lyrics} currentTime={currentTime} />
                    : <div
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <span>{t`No lyrics`}</span>
                    </div>
                }
              </Box>
            }

            {/* 播放控制 */}
            {
              (!isMobile || (isMobile && currentTab === 0)) &&
              <Box
                sx={{
                  // gridColumn: { xs: 'auto', sm: '1 / 3' },
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
                  <Typography variant="subtitle2" color={theme.palette.text.secondary} component="div" noWrap sx={{ minHeight: '22px' }}>
                    {(playQueue && currentMetaData) ? currentMetaData.artist : ''}
                  </Typography>
                  <Typography variant="subtitle1" color={theme.palette.text.secondary} component="div" noWrap sx={{ minHeight: '28px' }}>
                    {(playQueue && currentMetaData) ? currentMetaData.album : ''}
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
            }

            {
              isMobile &&
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  width: '100%',
                  gridColumn: { xs: 'auto', sm: '2 / 3' },
                }}
              >
                <VolumeControl />

                <Tabs
                  value={currentTab}
                  onChange={(_, newValue) => setCurrentTab(newValue)}
                  aria-label="player-tab"
                  sx={{ '& .MuiTab-root': { padding: 0, minWidth: '3rem' } }}
                >
                  <Tab icon={<PlayCircleOutlineRoundedIcon />} aria-label="play" />
                  <Tab icon={<LyricsRoundedIcon />} aria-label="lyrics" />
                </Tabs>

                <IconButton
                  aria-label="PlayQueue"
                  onClick={() => updatePlayQueueIsShow(true)}
                  className='app-region-no-drag'
                >
                  <QueueMusicRoundedIcon />
                </IconButton>

              </Box>
            }
          </Box>

        </Grid>

      </Container>
    </animated.div>
  )
}

export default Modern