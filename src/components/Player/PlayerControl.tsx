import { useMetaDataListStore, usePlayListStore, usePlayerStore } from '../../store'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ListIcon from '@mui/icons-material/List'
import PlayGrogress from './PlayGrogress'
import { useEffect, useState } from 'react'
import { MetaData } from '../../type'

const PlayerControl = ({ player }: { player: HTMLVideoElement }) => {

  const [playList, index, total, updateIndex] = usePlayListStore((state) => [
    state.playList,
    state.index,
    state.total,
    state.updateIndex,
  ])

  const [metaDataList] = useMetaDataListStore((state) => [state.metaDataList])

  const [metaData, setMetaData] = useState<MetaData | null>(null)

  const [
    playing,
    containerIsHiding,
    updatePlaying,
    updateContainerIsHiding
  ] = usePlayerStore(
    (state) => [
      state.playing,
      state.containerIsHiding,
      state.updatePlaying,
      state.updateContainerIsHiding,
    ]
  )

  useEffect(() => {
    player.onloadedmetadata = () => {
      player.play()
    }
  }, [player])

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

  const cover = ((!playList || !metaData || !metaData.cover))
    ? "/logo.png"
    : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))

  return (
    <div>
      {
        (player) &&
        <Grid container
          sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', pl: { sm: 1, xs: 0.5 }, pr: { sm: 1, xs: 0.5 }, pb: { sm: 1, xs: 0.5 } }} >
          {/* 播放进度 */}
          <Grid item xs={12}>
            <PlayGrogress player={player} />
          </Grid>
          <Grid container wrap={'nowrap'} sx={{ alignItems: 'center' }} >
            {/* 歌曲信息 */}
            <Grid item xs textAlign={'left'} zeroMinWidth>
              {/* <ButtonBase sx={{ height: '100%' }} onClick={() => updateContainerIsHiding(false)}> */}
              <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', overflow: 'hidden' }} wrap={'nowrap'} >
                <Grid item xs="auto" textAlign={'center'}>
                  <Box sx={{ width: '4rem', height: '4rem' }}>
                    <img style={{ maxWidth: '4rem', maxHeight: '4rem' }} src={cover} />
                  </Box>
                </Grid>
                <Grid item xs sx={{ pl: 1 }} zeroMinWidth>
                  <Typography variant="body1" component="div" noWrap>
                    {(!playList || !metaData) ? 'Not playing' : metaData.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div" noWrap>
                    {(!playList || !metaData) ? '0 / 0' : `${metaData.artist} ${index + 1} / ${total}`}
                  </Typography>
                </Grid>
              </Grid>
              {/* </ButtonBase> */}
            </Grid>
            {/* 基本控制按钮 */}
            <Grid item sm={3} xs={5}>
              <IconButton aria-label="previous" onClick={handleClickPrev} >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton aria-label="play/pause" onClick={handleClickPlayPause}>
                {(playing) ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
              </IconButton>
              <IconButton aria-label="next" onClick={handleClickNext} >
                <SkipNextIcon />
              </IconButton>
            </Grid>
            {/* 其他按钮 */}
            <Grid item xs textAlign={'right'} sx={{ display: { sm: 'block', xs: 'none' } }} >
              <IconButton sx={{ display: { sm: 'inline-grid', xs: 'none' } }} >
                <ListIcon />
              </IconButton>
              <IconButton
                sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
                onClick={() => updateContainerIsHiding(!containerIsHiding)}>
                {containerIsHiding ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      }
    </div>
  )
}

export default PlayerControl