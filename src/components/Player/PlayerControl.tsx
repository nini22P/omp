import { ButtonBase, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import ListIcon from '@mui/icons-material/List'
import { MetaData } from '../../type'
import PlayerControlSlider from './PlayerControlSlider'
import usePlayListStore from '../../store/usePlayListStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'

const PlayerControl = ({ player, metaData, cover, handleClickPlayPause, handleClickNext, handleClickPrev, handleTimeRangeOnInput }
  : {
    player: HTMLVideoElement,
    metaData: MetaData | null,
    cover: string,
    handleClickPlayPause: () => void,
    handleClickNext: () => void,
    handleClickPrev: () => void,
    handleTimeRangeOnInput: (e: Event) => void,
  }) => {

  const [type, playList] = usePlayListStore((state) => [
    state.type,
    state.playList,
  ])

  const [playListIsShow, updateAudioViewIsShow, updateVideoViewIsShow, updatePlayListIsShow] = useUiStore((state) => [
    state.playListIsShow,
    state.updateAudioViewIsShow,
    state.updateVideoViewIsShow,
    state.updatePlayListIsShow,
  ])

  const [playing, currentTime, duration] = usePlayerStore((state) => [state.playing, state.currentTime, state.duration])

  return (
    <div>
      {
        (player) &&
        <Grid container
          sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', }}
        >
          {/* 播放进度 */}
          <Grid xs={12}>
            <PlayerControlSlider
              handleTimeRangeOnInput={handleTimeRangeOnInput}
              currentTime={currentTime}
              duration={duration} />
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
            <Grid sm={3} xs={5}>
              <IconButton aria-label="previous" onClick={handleClickPrev} >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton aria-label="play/pause" onClick={handleClickPlayPause}>
                {(playing) ? <PauseCircleOutlinedIcon sx={{ height: 38, width: 38 }} /> : <PlayCircleOutlinedIcon sx={{ height: 38, width: 38 }} />}
              </IconButton>
              <IconButton aria-label="next" onClick={handleClickNext} >
                <SkipNextIcon />
              </IconButton>
            </Grid>

            {/* 其他按钮 */}
            <Grid
              xs
              textAlign={'right'}
              sx={{ display: { sm: 'block', xs: 'none' } }}
            >
              <IconButton
                sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
                onClick={() => updatePlayListIsShow(!playListIsShow)}
              >
                <ListIcon />
              </IconButton>
            </Grid>

          </Grid>

        </Grid>
      }
    </div>
  )
}

export default PlayerControl