import { useEffect, useMemo, useRef, useState } from 'react'
import { Container, IconButton, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import * as mm from 'music-metadata-browser'
import AudioView from './AudioView'
import PlayerControl from './PlayerControl'
import useMetaDataListStore from '../../store/useMetaDataListStore'
import usePlayListStore from '../../store/usePlayListStore'
import usePlayerStore from '../../store/usePlayerStore'
import PlayList from '../PlayList'
import useUiStore from '../../store/useUiStore'
import { MetaData } from '../../type'

const Player = ({ getFileData }: { getFileData: (filePath: string) => Promise<any> }) => {

  const [type, playList, current, updateCurrent] = usePlayListStore((state) => [state.type, state.playList, state.current, state.updateCurrent])
  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [metaDataList, insertMetaDataList] = useMetaDataListStore((state) => [state.metaDataList, state.insertMetaDataList])
  const [shuffle, repeat, updateCurrentTime, updateDuration, updateRepeat] = usePlayerStore((state) => [state.shuffle, state.repeat, state.updateCurrentTime, state.updateDuration, state.updateRepeat])
  const [videoViewIsShow, controlIsShow, updateVideoViewIsShow, updateControlIsShow, updateFullscreen]
    = useUiStore((state) => [state.videoViewIsShow, state.controlIsShow, state.updateVideoViewIsShow, state.updateControlIsShow, state.updateFullscreen])

  const playerRef = (useRef<HTMLVideoElement>(null))
  const player = playerRef.current   // 声明播放器对象
  const [url, setUrl] = useState('')

  // 获取当前播放文件链接
  useMemo(() => {
    if (playList !== null) {
      getFileData(playList[current].path).then((res) => {
        console.log('开始播放', playList[current].path)
        setUrl(res['@microsoft.graph.downloadUrl'])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playList, current])

  // 预载完毕后立即播放并更新总时长
  useMemo(() => {
    if (player !== null) {
      updateDuration(0)
      player.load()
      player.onloadedmetadata = () => {
        if (type === 'video') {
          updateVideoViewIsShow(true)
        }
        player.play()
        updateDuration(player.duration)
      }
    }
  }, [player, type, updateVideoViewIsShow, updateDuration])

  // 设置当前播放进度
  useEffect(() => {
    if (player)
      player.ontimeupdate = () => {
        updateCurrentTime(player.currentTime)
      }
  }, [player, updateCurrentTime])

  // 播放开始
  const handleClickPlay = () => {
    if (player && !isNaN(player.duration)) {
      player.play()
    }
  }

  // 播放暂停
  const handleClickPause = () => {
    if (player && !isNaN(player.duration)) {
      player.pause()
    }
  }

  // 下一曲
  const handleClickNext = () => {
    if (player && current + 1 !== playList?.length && playList) {
      player.pause()
      if (shuffle)
        updateCurrent(Math.floor(Math.random() * (playList.length)))
      else
        updateCurrent(current + 1)
    }
  }

  // 上一曲
  const handleClickPrev = () => {
    if (player && current !== 0 && playList) {
      player.pause()
      if (shuffle)
        updateCurrent(Math.floor(Math.random() * (playList.length)))
      else
        updateCurrent(current - 1)
    }
  }

  // 默认快进时长
  const defaultSkipTime = 10

  // 快进
  const handleClickSeekbackward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.max(player.currentTime - skipTime, 0)
    }
  }

  // 快退
  const handleClickSeekforward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.min(player.currentTime + skipTime, player.duration)
    }
  }

  /**
 * 点击进度条
 * @param current 
 */
  const handleTimeRangeonChange = (current: number | number[]) => {
    if (player && !isNaN(player.duration) && typeof (current) === 'number') {
      updateCurrentTime(player.duration / 1000 * Number(current))
      player.currentTime = player.duration / 1000 * Number(current)
      player.play()
    }
  }

  // 重复
  const handleClickRepeat = () => {
    if (repeat === 'off')
      updateRepeat('all')
    if (repeat === 'all')
      updateRepeat('one')
    if (repeat === 'one')
      updateRepeat('off')
  }

  // 播放结束
  const onEnded = () => {
    if (playList) {
      if (current + 1 === playList?.length) {
        if (repeat === 'all')
          if (shuffle)
            updateCurrent(Math.floor(Math.random() * (playList.length)))
          else
            updateCurrent(0)
        if (repeat === 'one')
          player?.play()
      } else {
        if (repeat === 'off')
          if (shuffle)
            updateCurrent(Math.floor(Math.random() * (playList.length)))
          else
            updateCurrent(current + 1)
        if (repeat === 'one')
          player?.play()
      }
    }
  }

  // 获取 metadata
  useMemo(() => {
    if (playerRef.current !== null) {
      playerRef.current.onplay = () => {
        if (type === 'audio' && playList !== null) {
          console.log('开始获取 metadata', 'path:', playList[current].path)
          const path = playList[current].path
          if (metaDataList.some(item => item.path === path)) {
            console.log('跳过获取 metadata', 'path:', path)
          } else {
            mm.fetchFromUrl(url).then(metadata => {
              if (metadata) {
                if (metadata.common.title !== undefined) {
                  console.log('获取 metadata', metadata)
                  const metaData = {
                    path: path,
                    title: metadata.common.title,
                    artist: metadata.common.artist,
                    albumArtist: metadata.common.albumartist,
                    album: metadata.common.album,
                    year: metadata.common.year,
                    genre: metadata.common.genre,
                    cover: metadata.common.picture,
                  }
                  insertMetaDataList(metaData)
                }
              }
              else {
                console.log('未能获取 metadata')
              }
            })
          }
        }
      }
    }
  }, [type, playList, current, url, metaDataList, insertMetaDataList])

  // 根据播放列表和元数据列表更新当前音频元数据
  useEffect(() => {
    if (playList) {
      const test = metaDataList.filter(metaData => metaData.path === playList[current].path)
      console.log('设定当前音频元数据')
      if (test.length === 1) {
        setMetaData({
          ...test[0],
          size: playList[current].size
        })
      } else {
        setMetaData({
          title: playList[current].title,
          artist: '',
          path: playList[current].path,
        })
      }
    }
  }, [current, metaDataList, playList])

  // 设定封面
  const cover = useMemo(() => {
    return (!playList || !metaData || !metaData.cover)
      ? './cd.png'
      : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))
  }, [playList, metaData])

  // 添加 mediaSession
  function updatePositionState() {
    if ('setPositionState' in navigator.mediaSession && player && !isNaN(player.duration)) {
      navigator.mediaSession.setPositionState({
        duration: player.duration,
        playbackRate: player.playbackRate,
        position: player.currentTime,
      })
    }
  }
  if (!player?.paused) {
    updatePositionState()
  }
  useEffect(() => {
    if ('mediaSession' in navigator && player) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metaData?.title,
        artist: metaData?.artist,
        album: metaData?.album,
        artwork: [{ src: cover }]
      })
      navigator.mediaSession.setActionHandler('play', () => handleClickPlay())
      navigator.mediaSession.setActionHandler('pause', () => handleClickPause())
      navigator.mediaSession.setActionHandler('nexttrack', () => handleClickNext())
      navigator.mediaSession.setActionHandler('previoustrack', () => handleClickPrev())
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || defaultSkipTime
        handleClickSeekbackward(skipTime)
        updatePositionState()
      })
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || defaultSkipTime
        handleClickSeekforward(skipTime)
        updatePositionState()
      })
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          if (details.fastSeek && 'fastSeek' in player) {
            player.fastSeek(details.seekTime)
            return
          }
          player.currentTime = details.seekTime
        }
        updatePositionState()
      })
      return () => {
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
        navigator.mediaSession.setActionHandler('seekbackward', null)
        navigator.mediaSession.setActionHandler('seekforward', null)
        navigator.mediaSession.setActionHandler('seekto', null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, player?.paused, cover, metaData?.album, metaData?.artist, metaData?.title])

  // 播放视频时自动隐藏ui
  useEffect(() => {
    if (type === 'video' && videoViewIsShow) {
      let timer: number | undefined
      const resetTimer = () => {
        updateControlIsShow(true)
        clearTimeout(timer)
        timer = (setTimeout(() => updateControlIsShow(false), 3000))
      }
      resetTimer()
      window.addEventListener('mousemove', resetTimer)
      window.addEventListener('mousedown', resetTimer)
      window.addEventListener('keydown', resetTimer)
      return () => {
        window.removeEventListener('mousemove', resetTimer)
        window.removeEventListener('mousedown', resetTimer)
        window.removeEventListener('keydown', resetTimer)
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, videoViewIsShow])

  // 检测全屏
  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log('全屏状态改变')
      updateFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  })

  const handleClickFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'all 0.5s' }}
        style={(videoViewIsShow) ? { top: '0' } : { top: '100vh' }}
      >
        <Grid container
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'start',
            backgroundColor: '#000'
          }}>
          <Grid xs={12} sx={{ width: '100%', height: '100%' }}>
            <video
              width={'100%'}
              height={'100%'}
              src={url}
              autoPlay
              ref={playerRef}
              onEnded={() => onEnded()}
              onDoubleClick={() => handleClickFullscreen()}
            />
          </Grid>

          {/* 视频播放顶栏 */}
          <Grid xs={12}
            position={'absolute'}
            sx={controlIsShow ? { top: 0, left: 0, borderRadius: '0 0 5px 0', backgroundColor: '#ffffffee', width: 'auto' } : { display: 'none' }}
          >
            <IconButton aria-label="close" onClick={() => {
              updateVideoViewIsShow(false)
              updateControlIsShow(true)
            }} >
              <KeyboardArrowDownOutlinedIcon />
            </IconButton>
          </Grid>

        </Grid>

      </Container>
      <Paper
        elevation={0}
        square={true}
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.1), 0px -4px 4px -2px rgba(0, 0, 0, 0.1)' }}
        style={(videoViewIsShow) ? { backgroundColor: '#ffffffee' } : { backgroundColor: '#ffffff' }}
      >
        <Container
          maxWidth={false}
          disableGutters={true}
        >
          {
            playerRef.current && <div>
              <div style={(controlIsShow) ? {} : { display: 'none' }}>
                <PlayerControl
                  player={playerRef.current}
                  metaData={metaData}
                  cover={cover}
                  handleClickPlay={handleClickPlay}
                  handleClickPause={handleClickPause}
                  handleClickNext={handleClickNext}
                  handleClickPrev={handleClickPrev}
                  handleClickSeekforward={handleClickSeekforward}
                  handleClickSeekbackward={handleClickSeekbackward}
                  handleTimeRangeonChange={handleTimeRangeonChange}
                  handleClickRepeat={handleClickRepeat}
                  handleClickFullscreen={handleClickFullscreen}
                />
              </div>
              <AudioView
                player={playerRef.current}
                metaData={metaData}
                cover={cover}
                handleClickPlay={handleClickPlay}
                handleClickPause={handleClickPause}
                handleClickNext={handleClickNext}
                handleClickPrev={handleClickPrev}
                handleClickSeekforward={handleClickSeekforward}
                handleClickSeekbackward={handleClickSeekbackward}
                handleTimeRangeonChange={handleTimeRangeonChange}
                handleClickRepeat={handleClickRepeat}
                handleClickFullscreen={handleClickFullscreen}
              />
              <PlayList />
            </div>
          }
        </Container>
      </Paper >

    </div>
  )
}

export default Player