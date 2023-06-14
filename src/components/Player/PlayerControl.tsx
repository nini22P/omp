import { ButtonBase, IconButton, Slider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import ListIcon from '@mui/icons-material/List'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
// import PictureInPictureIcon from '@mui/icons-material/PictureInPicture'
import { MetaData } from '../../type'
import usePlayListStore from '../../store/usePlayListStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { timeShift } from '../../util'
import { shallow } from 'zustand/shallow'

const PlayerControl = (
  {
    player,
    metaData,
    cover,
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
      player: HTMLVideoElement,
      metaData: MetaData | null,
      cover: string,
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

  const [type, playList] = usePlayListStore((state) => [state.type, state.playList], shallow)

  const [playListIsShow, fullscreen, updateAudioViewIsShow, updateVideoViewIsShow, updatePlayListIsShow] = useUiStore(
    (state) => [state.playListIsShow, state.fullscreen, state.updateAudioViewIsShow, state.updateVideoViewIsShow, state.updatePlayListIsShow], shallow)

  const [currentTime, duration, shuffle, repeat, updateShuffle] = usePlayerStore(
    (state) => [state.currentTime, state.duration, state.shuffle, state.repeat, state.updateShuffle], shallow)

  return (
    <div>
      {
        (player) &&
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
                sx={{ color: '#222' }}
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
                    <Grid xs="auto" textAlign={'center'}>
                      <img style={{ width: '4rem', height: '4rem', objectFit: 'contain' }} src={cover} />
                    </Grid>}
                  <Grid xs sx={{ pl: 1 }} minWidth={0}>
                    <Typography variant="body1" component="div" noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.title}
                    </Typography>
                    <div>
                      {(!playList || !metaData) || <Typography variant="subtitle1" color="text.secondary" component="div" noWrap>
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
                <ShuffleIcon sx={{ height: 20, width: 20, display: { sm: 'inline-grid', xs: 'none' } }} style={(shuffle) ? {} : { color: '#bbb' }} />
              </IconButton>
              <IconButton aria-label="previous" onClick={handleClickPrev} >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton sx={{ display: { sm: 'inline-grid', xs: 'none' } }} aria-label="backward" onClick={() => handleClickSeekbackward(10)} >
                <FastRewindIcon />
              </IconButton>
              {
                (player.paused)
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
                      style={(repeat === 'off') ? { color: '#bbb' } : {}}
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
              <IconButton onClick={() => updatePlayListIsShow(!playListIsShow)}>
                <ListIcon sx={{ display: { sm: 'inline-grid', xs: 'none' } }} />
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
      }
    </div >
  )
}

export default PlayerControl