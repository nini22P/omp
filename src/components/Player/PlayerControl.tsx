import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import ListIcon from '@mui/icons-material/List'
import PlayerControlSlider from './PlayerControlSlider'
import { useEffect, useMemo, useState } from 'react'
import { MetaData } from '../../type'
import usePlayListStore from '../../store/usePlayListStore'
import useMetaDataListStore from '../../store/useMetaDataListStore'
import usePlayerStore from '../../store/usePlayerStore'

const PlayerControl = ({ player, setAudioViewIsDisplay }: { player: HTMLVideoElement, setAudioViewIsDisplay: (arg0: boolean) => void }) => {

  const [type, playList, index, total, playListIsShow, updateIndex, updatePlayListIsShow] = usePlayListStore((state) => [
    state.type,
    state.playList,
    state.index,
    state.total,
    state.playListIsShow,
    state.updateIndex,
    state.updatePlayListIsShow,
  ])

  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [metaDataList] = useMetaDataListStore((state) => [state.metaDataList])

  const [
    playing,
    currentTime,
    duration,
    updatePlaying,
    updateCurrentTime,
    updateDuration,
    updateContainerIsHiding
  ] = usePlayerStore(
    (state) => [
      state.playing,
      state.currentTime,
      state.duration,
      state.updatePlaying,
      state.updateCurrentTime,
      state.updateDuration,
      state.updateContainerIsHiding,
    ]
  )

  // 设置当前播放进度
  useEffect(() => {
    player.ontimeupdate = () => {
      updateCurrentTime(player.currentTime)
    }
  }, [player, updateCurrentTime])

  // 加载完毕后立即播放并更新总时长
  useEffect(() => {
    player.onloadedmetadata = () => {
      player.play()
      updateDuration(player.duration)
      if (type === 'video')
        updateContainerIsHiding(false)
    }
  }, [player, type, updateContainerIsHiding, updateDuration])

  useEffect(() => {
    if (playList) {
      const test = metaDataList.filter(metaData => metaData.path === playList[index].path)
      if (test.length === 1) {
        setMetaData({
          ...test[0],
          size: playList[index].size
        })
      } else {
        setMetaData({
          title: playList[index].title,
          artist: '',
          path: playList[index].path,
        })
      }
    }

  }, [index, metaDataList, playList])

  /**
   * 播放暂停
   */
  const handleClickPlayPause = () => {
    if (!isNaN(player.duration)) {
      if (player.paused) {
        player.play()
        updatePlaying(true)
      }
      else {
        player.pause()
        updatePlaying(false)
      }
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

  /**
* 点击进度条
* @param e 
*/
  const handleTimeRangeOnInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target && !isNaN(player.duration)) {
      player.currentTime = player.duration / 1000 * Number(target.value)
      player.play()
      updatePlaying(true)
    }
  }

  const cover = useMemo(() => {
    return (!playList || !metaData || !metaData.cover)
      ? './cd.png'
      : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))
  }, [playList, metaData])

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
                    setAudioViewIsDisplay(true)
                  if (type === 'video')
                    updateContainerIsHiding(false)
                }}>
                <Grid container
                  xs
                  sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', overflow: 'hidden' }}
                  wrap={'nowrap'} >
                  <Grid xs="auto" textAlign={'center'}>
                    <Box sx={{ width: '4rem', height: '4rem' }}>
                      <img style={{ maxWidth: '4rem', maxHeight: '4rem' }} src={cover} />
                    </Box>
                  </Grid>
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