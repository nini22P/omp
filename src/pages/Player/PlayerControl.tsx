import { Box, ButtonBase, CircularProgress, Container, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Popover, Slider, Typography, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import useFullscreen from '@/hooks/ui/useFullscreen'
import usePlayerControl from '@/hooks/player/usePlayerControl'
import { timeShift } from '@/utils'
import { useState } from 'react'
import { t } from '@lingui/macro'

const PlayerControl = ({ player }: { player: HTMLVideoElement | null }) => {

  const theme = useTheme()
  const [type, playQueue] = usePlayQueueStore((state) => [state.type, state.playQueue])

  const [
    videoViewIsShow,
    playQueueIsShow,
    fullscreen,
    shuffle,
    repeat,
    volume,
    playbackRate,
    updateAudioViewIsShow,
    updateVideoViewIsShow,
    updatePlayQueueIsShow,
    updateVolume,
    updatePlaybackRate,
  ] = useUiStore(
    (state) => [
      state.videoViewIsShow,
      state.playQueueIsShow,
      state.fullscreen,
      state.shuffle,
      state.repeat,
      state.volume,
      state.playbackRate,
      state.updateAudioViewIsShow,
      state.updateVideoViewIsShow,
      state.updatePlayQueueIsShow,
      state.updateVolume,
      state.updatePlaybackRate,
    ]
  )

  const [
    currentMetaData,
    playStatu,
    isLoading,
    cover,
    currentTime,
    duration,
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

  const handleClickMediaInfo = () => {
    if (type === 'audio')
      updateAudioViewIsShow(true)
    if (type === 'video')
      updateVideoViewIsShow(!videoViewIsShow)
  }

  const iconStyles = {
    small: { width: 20, height: 20 },
    large: { width: 38, height: 38 }
  }

  const [volumeAnchorEl, setVolumeAnchorEl] = useState<HTMLElement | null>(null)
  const volumeOpen = Boolean(volumeAnchorEl)

  const [menuAnchorEl, setMemuAnchorEl] = useState<HTMLElement | null>(null)
  const menuOpen = Boolean(menuAnchorEl)
  const [menuStatus, setMenuStatus] = useState<'playbackRate' | null>(null)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMemuAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMemuAnchorEl(null)
    setMenuStatus(null)
  }

  return (
    <Paper sx={{ backgroundColor: `${theme.palette.background.paper}99`, backdropFilter: 'blur(8px)' }}>
      <Container maxWidth={'xl'} disableGutters={true}>
        <Grid container
          sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', }}
        >
          {/* 播放进度 */}
          {/* <Grid xs={12}> */}
          <Grid container xs={12}
            pl={{ xs: 0, sm: 1 }}
            pr={{ xs: 0, sm: 1 }}
            sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
            <Grid
              xs='auto'
              sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
            >
              <Typography
                component='div'
                color='text.secondary'
              >
                {timeShift(currentTime)}
              </Typography>
            </Grid >
            <Grid xs
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
              xs='auto'
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

          <Grid container xs={12} wrap={'nowrap'} sx={{ alignItems: 'center' }} >
            {/* 媒体信息 */}
            <Grid container
              xs
              textAlign={'left'} minWidth={0}>
              <ButtonBase
                sx={{ height: '4rem', width: '100%', borderRadius: '0.5rem' }}
                onClick={() => handleClickMediaInfo()}>
                <Grid xs container sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', overflow: 'hidden', flexGrow: 'nowrap' }}>
                  <Grid xs="auto" sx={{ width: '4rem', height: '4rem', padding: '0.5rem' }}>
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
                  <Grid xs sx={{ pl: 1 }} minWidth={0}>
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
            <Grid container xs={5} sm={'auto'} wrap='nowrap' paddingX={{ xs: 0, sm: 1 }} sx={{ justifyContent: 'center', alignItems: 'center', }} >
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
              xs
              textAlign={'right'}
              wrap='nowrap'
              sx={{ display: { sm: 'block', xs: 'none' } }}
              pr={1}
            >
              <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => setVolumeAnchorEl(event.currentTarget)} >
                {
                  volume === 0
                    ? <VolumeOffIcon sx={{ display: 'inline-grid' }} />
                    : volume < 50
                      ? <VolumeDownIcon sx={{ display: 'inline-grid' }} />
                      : <VolumeUpIcon sx={{ display: 'inline-grid' }} />
                }
              </IconButton>
              <Popover
                open={volumeOpen}
                onClose={() => setVolumeAnchorEl(null)}
                anchorEl={volumeAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem 0.5rem 1rem 0.5rem',
                    gap: '1em',
                  }}
                >
                  {volume}
                  <Slider
                    aria-label="Volume"
                    orientation="vertical"
                    value={volume}
                    min={0}
                    max={100}
                    onChange={(_, value) => updateVolume(value as number)}
                    sx={{
                      minHeight: '160px',
                    }}
                  />
                </Box>
              </Popover>

              <IconButton onClick={() => updatePlayQueueIsShow(!playQueueIsShow)}>
                <PlaylistPlayRoundedIcon sx={{ display: { sm: 'inline-grid', xs: 'none' } }} />
              </IconButton>

              <IconButton onClick={() => handleClickFullscreen()} >
                {
                  fullscreen
                    ? <CloseFullscreenRoundedIcon sx={{ height: 18, width: 18, display: { sm: 'inline-grid', xs: 'none' } }} />
                    : <OpenInFullRoundedIcon sx={{ height: 18, width: 18, display: { sm: 'inline-grid', xs: 'none' } }} />
                }
              </IconButton>

              <IconButton onClick={handleClickMenu}>
                <MoreHorizRoundedIcon sx={{ display: { sm: 'inline-grid', xs: 'none' } }} />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                {
                  (!menuStatus) &&
                  <MenuItem onClick={() => setMenuStatus('playbackRate')}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ListItemIcon>
                        <SpeedRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary={t`Playback rate`} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                      {playbackRate.toFixed(2)} <NavigateNextRoundedIcon />
                    </Box>
                  </MenuItem>
                }
                {
                  (menuStatus === 'playbackRate') &&
                  <div>
                    <MenuItem onClick={() => setMenuStatus(null)}>
                      <ListItemIcon>
                        <NavigateBeforeRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary={t`Playback rate`} />
                    </MenuItem>
                    {
                      [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4].map((speed) => (
                        <MenuItem
                          key={speed}
                          onClick={() => {
                            updatePlaybackRate(speed)
                            setMenuStatus(null)
                          }}
                        >
                          <ListItemIcon>
                            <CheckRoundedIcon sx={{ visibility: speed === playbackRate ? 'visible' : 'hidden' }} />
                          </ListItemIcon>
                          {speed.toFixed(2)}
                        </MenuItem>
                      ))
                    }
                  </div>
                }
              </Menu>
            </Grid>

          </Grid>

        </Grid>
      </Container >
    </Paper>
  )
}

export default PlayerControl