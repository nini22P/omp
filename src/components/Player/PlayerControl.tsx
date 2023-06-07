import { useEffect } from 'react'
import usePlayerStore from '../../store'
import { Box, Card, CardContent, CardMedia, Grid, IconButton, Slider, Typography } from '@mui/material'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

const PlayerControl = ({ playerRef }: any) => {

  const [
    playList,
    index,
    total,
    playing,
    currentTime,
    duration,
    containerIsHiding,
    updatePlaying,
    updateIndex,
    updateCurrentTime,
    updateDuration,
    updateContainerIsHiding
  ] = usePlayerStore(
    (state) => [
      state.playList,
      state.index,
      state.total,
      state.playing,
      state.currentTime,
      state.duration,
      state.containerIsHiding,
      state.updatePlaying,
      state.updateIndex,
      state.updateCurrentTime,
      state.updateDuration,
      state.updateContainerIsHiding,
    ]
  )

  // 获取播放器实例
  const player = (playerRef.current === null) ? null : playerRef.current

  // 更新当前播放进度
  useEffect(() => {
    if (player !== null) {
      player.ontimeupdate = () => {
        updateCurrentTime(player.currentTime)
      }
      player.onloadedmetadata = () => {
        updateDuration(player.duration)
        player.play()
      }
    }
  }, [player])
  /**
   * 播放暂停
   */
  const handleClickPlayPause = () => {
    if (player.paused) {
      player.play()
      updatePlaying(true)
    }
    else {
      player.pause()
      updatePlaying(false)
    }
  }

  /**
 * 下一曲
 */
  const handleClickNext = () => {
    if (index + 1 !== total) {
      player.pause()
      updateIndex(index + 1)
    }
  }

  /**
   * 上一曲
   */
  const handleClickPrev = () => {
    if (index !== 0) {
      player.pause()
      updateIndex(index - 1)
    }
  }

  const handleTimeRangeOnInput = (e: any) => {
    player.currentTime = duration / 1000 * e.target.value
    player.play()
    updatePlaying(true)
  }

  const timeShift = (time: number) => {
    const minute = Number((time / 60).toFixed())
    const second = Number((time % 60).toFixed())
    return `${(minute < 10) ? '0' + minute : minute} : ${(second < 10) ? '0' + second : second}`
  }

  return (
    <div >
      <Grid container spacing={1} sx={{ textAlign: 'center', backgroundColor: '#eee' }} >
        <Grid item xs={2}>
          <span>{timeShift(currentTime)}</span>
        </Grid>
        <Grid item xs={8}>
          <Slider
            min={0} max={1000} value={(duration === 0) ? 0 : currentTime / duration * 1000}
            onChange={(e) => handleTimeRangeOnInput(e)}
          />
        </Grid>
        <Grid item xs={2}>
          {timeShift(duration)}
        </Grid>
        <Grid item xs={1}>
          <CardMedia
            component="img"
            sx={{ width: 80 }}
            image="/logo.png"
            alt="Live from space album cover"
          />
        </Grid>
        <Grid item xs={4} wrap={'nowrap'} zeroMinWidth>
          <Typography component="div" variant="h6" noWrap>
            {!playList ? 'Not playing' : playList[index].name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {!playList ? '0 / 0' : `${index + 1} / ${total}`}
          </Typography>
        </Grid>
        <Grid item xs={3} >
          <IconButton aria-label="previous" onClick={handleClickPrev} >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="play/pause" onClick={() => handleClickPlayPause()}>
            {(playing) ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
          </IconButton>
          <IconButton aria-label="next" onClick={handleClickNext} >
            <SkipNextIcon />
          </IconButton>
        </Grid>
        <Grid item xs={1} >
          <IconButton onClick={() => updateContainerIsHiding(!containerIsHiding)}>
            {containerIsHiding ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default PlayerControl