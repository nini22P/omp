import { ButtonBase, Container, IconButton, Slider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
// import PictureInPictureIcon from '@mui/icons-material/PictureInPicture'
import { MetaData } from '../../type'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { timeShift } from '../../util'
import { shallow } from 'zustand/shallow'

const PlayerControl = (
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
    : {
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
    }) => {

  const [type, playQueue] = usePlayQueueStore((state) => [state.type, state.playQueue], shallow)

  const [playQueueIsShow, fullscreen, updateAudioViewIsShow, updateVideoViewIsShow, updatePlayQueueIsShow] = useUiStore(
    (state) => [state.playQueueIsShow, state.fullscreen, state.updateAudioViewIsShow, state.updateVideoViewIsShow, state.updatePlayQueueIsShow], shallow)

  const [isPlaying, cover, currentTime, duration, shuffle, repeat, updateShuffle] = usePlayerStore(
    (state) => [state.isPlaying, state.cover, state.currentTime, state.duration, state.shuffle, state.repeat, state.updateShuffle], shallow)

  return (
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
          <Grid xs='auto' >
            <Typography
              component='div'
              color='text.secondary'
              sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
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
            />
          </Grid>
          <Grid xs='auto'>
            <Typography
              component='div'
              color='text.secondary'
              sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
            >
              {timeShift((duration) ? duration : 0)}
            </Typography>
          </Grid>
          {/* </Grid> */}
        </Grid>

        <Grid container xs={12} wrap={'nowrap'} sx={{ alignItems: 'center' }} >
          {/* 歌曲信息 */}
          <Grid container
            xs
            textAlign={'left'} minWidth={0}>
            <ButtonBase
              sx={{ height: '100%', width: '100%' }}
              onClick={() => {
                if (type === 'audio')
                  updateAudioViewIsShow(true)
                if (type === 'video')
                  updateVideoViewIsShow(true)
              }}>
              <Grid container
                xs
                sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', overflow: 'hidden' }}
                wrap={'nowrap'} >
                {(type === 'audio') &&
                  <Grid xs="auto" textAlign={'center'} width={'4rem'} height={'4rem'}>
                    <img style={{ width: '4rem', height: '4rem', objectFit: 'cover' }} src={cover} />
                  </Grid>}
                <Grid xs sx={{ pl: 1 }} minWidth={0}>
                  <Typography variant="body1" component="div" noWrap>
                    {(!playQueue || !metaData) ? 'Not playing' : metaData.title}
                  </Typography>
                  <div>
                    {(!playQueue || !metaData) || <Typography variant="subtitle1" color="text.secondary" component="div" noWrap>
                      {(metaData.artist) && metaData.artist}{(metaData.album) && ` • ${metaData.album}`}
                    </Typography>}
                  </div>
                </Grid>
              </Grid>
            </ButtonBase>
          </Grid>

          {/* 基本控制按钮 */}
          <Grid container lg={3} md={4} sm={5} xs={5} wrap='nowrap' sx={{ justifyContent: 'center', alignItems: 'center', }} >
            <IconButton aria-label="shuffle" onClick={() => updateShuffle(!shuffle)}>
              <ShuffleIcon sx={{ height: 20, width: 20, display: { sm: 'inline-grid', xs: 'none' } }} style={(shuffle) ? {} : { color: '#aaa' }} />
            </IconButton>
            <IconButton aria-label="previous" onClick={handleClickPrev} >
              <SkipPreviousIcon />
            </IconButton>
            <IconButton sx={{ display: { sm: 'inline-grid', xs: 'none' } }} aria-label="backward" onClick={() => handleClickSeekbackward(10)} >
              <FastRewindIcon />
            </IconButton>
            {
              (!isPlaying)
                ?
                <IconButton aria-label="play" onClick={() => handleClickPlay()}>
                  <PlayCircleOutlinedIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
                :
                <IconButton aria-label="pause" onClick={() => handleClickPause()}>
                  <PauseCircleOutlinedIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
            }
            <IconButton sx={{ display: { sm: 'inline-grid', xs: 'none' } }} aria-label="forward" onClick={() => handleClickSeekforward(10)} >
              <FastForwardIcon />
            </IconButton>
            <IconButton aria-label="next" onClick={handleClickNext} >
              <SkipNextIcon />
            </IconButton>
            <IconButton aria-label="repeat" onClick={() => handleClickRepeat()} >
              {
                (repeat === 'one')
                  ?
                  <RepeatOneIcon sx={{ height: 20, width: 20, display: { sm: 'inline-grid', xs: 'none' } }} />
                  :
                  <RepeatIcon
                    sx={{ height: 20, width: 20, display: { sm: 'inline-grid', xs: 'none' } }}
                    style={(repeat === 'off') ? { color: '#aaa' } : {}}
                  />
              }

            </IconButton>
          </Grid>

          {/* 其他按钮 */}
          <Grid
            xs
            textAlign={'right'}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            pr={1}
          >
            <IconButton onClick={() => updatePlayQueueIsShow(!playQueueIsShow)}>
              <QueueMusicIcon sx={{ display: { sm: 'inline-grid', xs: 'none' } }} />
            </IconButton>
            <IconButton onClick={() => handleClickFullscreen()} >
              {
                fullscreen
                  ? <CloseFullscreenIcon sx={{ height: 18, width: 18, display: { sm: 'inline-grid', xs: 'none' } }} />
                  : <OpenInFullIcon sx={{ height: 18, width: 18, display: { sm: 'inline-grid', xs: 'none' } }} />
              }
            </IconButton>
            {/* <IconButton  >
                <PictureInPictureIcon sx={{ height: 18, width: 18, display: { sm: 'inline-grid', xs: 'none' } }} />
              </IconButton> */}
          </Grid>

        </Grid>

      </Grid>
    </Container >
  )
}

export default PlayerControl