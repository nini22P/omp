import { Box, Container, IconButton, Slider, Typography } from '@mui/material'
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
import { extractColors } from 'extract-colors'

// import PictureInPictureIcon from '@mui/icons-material/PictureInPicture'
import { MetaData } from '../../type'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { timeShift } from '../../util'
import { shallow } from 'zustand/shallow'
import { useMemo, useState } from 'react'

const AudioView = (
  {
    metaData,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
    handleTimeRangeonChange,
    handleClickRepeat,
    handleClickFullscreen,
  }
    :
    {
      metaData: MetaData | null,
      handleClickPlay: () => void,
      handleClickPause: () => void,
      handleClickNext: () => void,
      handleClickPrev: () => void,
      handleClickSeekforward: (skipTime: number) => void,
      handleClickSeekbackward: (skipTime: number) => void,
      handleTimeRangeonChange: (current: number | number[]) => void,
      handleClickRepeat: () => void,
      handleClickFullscreen: () => void,
    }
) => {
  const [playQueue] = usePlayQueueStore((state) => [state.playQueue])

  const [audioViewIsShow, fullscreen, updateAudioViewIsShow, updatePlayQueueIsShow] = useUiStore(
    (state) => [state.audioViewIsShow, state.fullscreen, state.updateAudioViewIsShow, state.updatePlayQueueIsShow], shallow)

  const [isPlaying, cover, currentTime, duration, shuffle, repeat, updateShuffle] = usePlayerStore(
    (state) => [state.isPlaying, state.cover, state.currentTime, state.duration, state.shuffle, state.repeat, state.updateShuffle], shallow)

  const [noBackgound, setNoBackground] = useState(false)
  const [color, setColor] = useState('#ffffff')

  useMemo(() => {
    if (cover !== './cd.png')
      extractColors(cover)
        .then(color => setColor(color[0].hex))
        .catch(console.error)
  }, [cover])

  return (
    <div style={{
      transform: 'translateZ(0)', // blur 性能优化
    }}>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{
          width: '100%',
          height: '100dvh',
          position: 'fixed',
          transition: 'top 0.35s ease-in-out',
          background:
            (noBackgound || cover === './cd.png')
              ? `linear-gradient(rgba(50, 50, 50, 0.6), ${color}bb), #000`
              : `linear-gradient(rgba(50, 50, 50, 0.3), rgba(50, 50, 50, 0.3) ), url(${cover})  no-repeat center, #000`,
          backgroundSize: 'cover',
          color: '#fff',
          overflow: 'hidden'
        }}
        style={(audioViewIsShow) ? { top: '-100dvh' } : { top: '0' }}
      >
        <Box sx={{ backdropFilter: (noBackgound || cover === './cd.png') ? '' : 'blur(30px)' }}>
          <Container maxWidth={'xl'} disableGutters={true}>
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
                <IconButton aria-label="close" onClick={() => updateAudioViewIsShow(false)} >
                  <KeyboardArrowDownOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              <Grid xs={6} pr={{ xs: 1, sm: 0 }} textAlign={'right'}>
                <IconButton aria-label="PlayQueue" onClick={() => updatePlayQueueIsShow(true)} >
                  <QueueMusicOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
                <IconButton aria-label="NoBackground" onClick={() => setNoBackground(!noBackgound)} >
                  <PanoramaOutlinedIcon style={noBackgound ? { color: '#aaa' } : { color: '#fff' }} />
                </IconButton>
                <IconButton aria-label="Full" onClick={() => handleClickFullscreen()}>
                  {
                    fullscreen
                      ? <CloseFullscreenIcon style={{ height: 20, width: 20, color: '#fff' }} />
                      : <OpenInFullIcon style={{ height: 20, width: 20, color: '#fff' }} />
                  }
                </IconButton>
                {/* <IconButton aria-label="PictureInPicture" >
                  <PictureInPictureIcon style={{ height: 20, width: 20, color: '#fff' }} />
                </IconButton> */}
              </Grid>

              {/* 封面和音频信息 */}
              <Grid container
                maxWidth={'lg'}
                height={{ xs: 'calc(100dvh - 4rem)', sm: 'auto' }}
                flexDirection={{ xs: 'column', sm: 'row' }}
                wrap='nowrap'
                xs={12}
                sx={{
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
                pl={{ xs: 0, sm: 1 }}
                pr={{ xs: 0, sm: 1 }}
                gap={{ xs: 0, sm: 3 }}
              >
                {/* 封面 */}
                <Grid sm={4} xs={12} >
                  <img style={{ maxHeight: '100vw', width: '100%', objectFit: 'contain' }} src={cover} />
                </Grid>

                {/* 音频信息 */}
                <Grid sm={8} xs={12} pl={{ xs: 0, lg: 5 }} textAlign={'center'}>
                  <Grid xs={12} pl={4} pr={4} >
                    <Typography variant="h6" component="div" textAlign={'center'} noWrap>
                      {(!playQueue || !metaData) ? 'Not playing' : metaData.title}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(playQueue && metaData) && metaData.artist}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(playQueue && metaData) && metaData.album}
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
                      <SkipPreviousIcon sx={{ height: 48, width: 48 }} style={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton aria-label="backward" sx={{ display: { sm: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekbackward(10)} >
                      <FastRewindIcon sx={{ height: 32, width: 32 }} style={{ color: '#fff' }} />
                    </IconButton>
                    {
                      (!isPlaying)
                        ?
                        <IconButton aria-label="play" onClick={() => handleClickPlay()}>
                          <PlayCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />
                        </IconButton>
                        :
                        <IconButton aria-label="pause" onClick={() => handleClickPause()}>
                          <PauseCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />
                        </IconButton>
                    }
                    <IconButton aria-label="forward" sx={{ display: { sm: 'inline-grid', xs: 'none' } }} onClick={() => handleClickSeekforward(10)} >
                      <FastForwardIcon sx={{ height: 32, width: 32 }} style={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton aria-label="next" onClick={handleClickNext} >
                      <SkipNextIcon sx={{ height: 48, width: 48 }} style={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton aria-label="repeat" onClick={() => handleClickRepeat()} >
                      {
                        (repeat === 'one')
                          ?
                          < RepeatOneIcon sx={{ height: 28, width: 28 }} style={{ color: '#fff' }} />
                          :
                          <RepeatIcon sx={{ height: 28, width: 28 }} style={(repeat === 'off') ? { color: '#ccc' } : { color: '#fff' }} />
                      }

                    </IconButton>
                  </Grid>

                </Grid>
              </Grid>

            </Grid>
          </Container>
        </Box>

      </Container>
    </div >
  )
}

export default AudioView