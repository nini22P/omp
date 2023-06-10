import { Box, Container, IconButton, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { useMetaDataListStore, usePlayListStore, usePlayerStore } from "../../store"
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { useMemo, useState } from "react"
import { MetaData } from "../../type"
import AudioViewSlider from "./AudioViewSlider"
import vhCheck from 'vh-check'

const AudioView = (
  { player, audioViewIsDisplay, setAudioViewIsDisplay }
    : { player: HTMLVideoElement, audioViewIsDisplay: boolean, setAudioViewIsDisplay: (arg0: boolean) => void }
) => {
  const [playList, index, total, updateIndex] = usePlayListStore((state) => [
    state.playList,
    state.index,
    state.total,
    state.updateIndex,
  ])

  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [metaDataList] = useMetaDataListStore((state) => [state.metaDataList])

  const [
    playing,
    currentTime,
    duration,
    updatePlaying,
  ] = usePlayerStore(
    (state) => [
      state.playing,
      state.currentTime,
      state.duration,
      state.updatePlaying,
    ]
  )

  useMemo(() => {
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

  /**
 * 点击进度条
 * @param e 
 */
  const handleTimeRangeOnInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target) {
      player.currentTime = player.duration / 1000 * Number(target.value)
      player.play()
      updatePlaying(true)
    }
  }

  const cover = useMemo(() => {
    return (!playList || !metaData || !metaData.cover)
      ? "./logo.png"
      : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))
  }, [playList, metaData])

  return (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{
          width: '100%',
          height: 'calc(100vh - var(--vh-offset, 0px))',
          position: 'fixed',
          transition: 'all 0.5s',
          background: `linear-gradient(rgba(180, 180, 180, .5), rgb(180, 180, 180, .5)), url(${cover})  no-repeat center`,
          backgroundSize: 'cover',
          color: '#fff'
        }}
        style={(audioViewIsDisplay) ? { bottom: '0' } : { bottom: '-100vh' }}
      >
        <Box
          sx={{ backdropFilter: 'blur(25px)', }}
        >
          <Container
            maxWidth={'xl'}
            disableGutters={true}
          >
            <Grid container
              p={{ sm: 2, md: 4 }}
              sx={{
                width: '100%',
                height: 'calc(100vh - var(--vh-offset, 0px))',
                justifyContent: 'center',
                alignItems: 'start',
              }}
            >

              <Grid xs={6} >
                <IconButton aria-label="close" onClick={() => setAudioViewIsDisplay(false)} >
                  <KeyboardArrowDownOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              <Grid xs={6} textAlign={'right'}>
                <IconButton aria-label="PlayList" >
                  <QueueMusicOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              {/* 封面和专辑信息 */}
              <Grid container
                maxWidth={'lg'}
                xs={12}
                spacing={1}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* 封面 */}
                <Grid sm={4} xs={12}>
                  <Box sx={{ height: '100%', width: '100%' }}>
                    <img style={{ height: '100%', width: '100%' }} src={cover} />
                  </Box>
                </Grid>

                {/* 专辑信息 */}
                <Grid
                  sm={8}
                  xs={12}
                  textAlign={'center'}
                >
                  <Grid xs={12}>
                    <Typography variant="h6" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.title}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.artist}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.album}
                    </Typography>
                  </Grid>

                  {/* 播放进度条 */}
                  <Grid xs={12}  >
                    <AudioViewSlider
                      handleTimeRangeOnInput={handleTimeRangeOnInput}
                      currentTime={currentTime}
                      duration={duration}
                    />
                  </Grid>

                  <Grid xs={12} >
                    <IconButton aria-label="previous" onClick={handleClickPrev} >
                      <SkipPreviousIcon sx={{ height: 48, width: 48 }} style={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton aria-label="play/pause" onClick={handleClickPlayPause}>
                      {
                        (playing)
                          ? <PauseCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />
                          : <PlayCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />}
                    </IconButton>
                    <IconButton aria-label="next" onClick={handleClickNext} >
                      <SkipNextIcon
                        sx={{ height: 48, width: 48 }}
                        style={{ color: '#fff' }} />
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