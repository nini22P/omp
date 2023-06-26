import { useEffect, useMemo, useRef, useState } from 'react'
import { Container, IconButton, Paper, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import * as mm from 'music-metadata-browser'
import AudioView from './AudioView'
import PlayerControl from './PlayerControl'
import useMetaDataListStore from '../../store/useMetaDataListStore'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import PlayQueue from './PlayQueue'
import useUiStore from '../../store/useUiStore'
import { MetaData } from '../../type'
import { shallow } from 'zustand/shallow'
import { useControlHide } from '../../hooks/useControlHide'
import { useMediaSession } from '../../hooks/useMediaSession'
import { shufflePlayQueue } from '../../util'
import useHistoryStore from '../../store/useHistoryStore'
import useFilesData from '../../hooks/useFilesData'

const Player = () => {

  const theme = useTheme()

  const { getFileData } = useFilesData()

  const [type, playQueue, current, updateCurrent, updatePlayQueue] = usePlayQueueStore(
    (state) => [state.type, state.playQueue, state.current, state.updateCurrent, state.updatePlayQueue], shallow)

  const [metaData, setMetaData] = useState<MetaData | null>(null)

  const [metaDataList, insertMetaDataList] = useMetaDataListStore((state) => [state.metaDataList, state.insertMetaDataList], shallow)

  const [isPlaying, cover, shuffle, repeat, updateIsPlaying, updateCover, updateCurrentTime, updateDuration, updateRepeat] = usePlayerStore(
    (state) => [state.isPlaying, state.cover, state.shuffle, state.repeat, state.updateIsPlaying, state.updateCover, state.updateCurrentTime, state.updateDuration, state.updateRepeat], shallow)

  const [videoViewIsShow, controlIsShow, updateVideoViewIsShow, updateControlIsShow, updateFullscreen] = useUiStore(
    (state) => [state.videoViewIsShow, state.controlIsShow, state.updateVideoViewIsShow, state.updateControlIsShow, state.updateFullscreen], shallow)

  const [insertHistoryitem] = useHistoryStore((state) => [state.insertHistoryItem], shallow)

  const playerRef = (useRef<HTMLVideoElement>(null))
  const player = playerRef.current   // 声明播放器对象
  const [url, setUrl] = useState('')

  // 获取当前播放文件链接
  useMemo(() => {
    if (playQueue !== null && playQueue.length !== 0) {
      getFileData(playQueue.filter(item => item.index === current)[0].path).then((res) => {
        setUrl(res['@microsoft.graph.downloadUrl'])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playQueue, current])

  // 预载完毕后立即播放并更新总时长
  useMemo(() => {
    if (player !== null && playQueue) {
      updateDuration(0)
      player.load()
      player.onloadedmetadata = () => {
        if (type === 'video') {
          updateVideoViewIsShow(true) //类型是视频时打开视频播放
        }
        // player.play()
        updateIsPlaying(true)
        updateDuration(player.duration)
        const currentItem = playQueue.filter(item => item.index === current)[0]
        insertHistoryitem({
          fileName: currentItem.title,
          filePath: currentItem.path,
          fileSize: currentItem.size,
          fileType: type,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player?.src])

  // 播放开始暂停
  useEffect(() => {
    if (isPlaying) {
      console.log('开始播放', playQueue?.filter(item => item.index === current)[0].path)
      if (playQueue?.filter(item => item.index === current)[0].path)
        player?.play()
      else {
        updateIsPlaying(false)
      }
    }
    else
      player?.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  // 随机
  useEffect(() => {
    if (shuffle && playQueue) {
      const randomPlayQueue = shufflePlayQueue(playQueue, current)
      updatePlayQueue(randomPlayQueue)
    }
    if (!shuffle && playQueue) {
      updatePlayQueue([...playQueue].sort((a, b) => a.index - b.index))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle])

  // 设置当前播放进度
  useEffect(() => {
    if (player)
      player.ontimeupdate = () => {
        updateCurrentTime(player.currentTime)
      }
  }, [player, updateCurrentTime])

  // 播放视频时自动隐藏ui
  useControlHide(type, videoViewIsShow)

  // 播放开始
  const handleClickPlay = () => {
    updateIsPlaying(true)
  }

  // 播放暂停
  const handleClickPause = () => {
    updateIsPlaying(false)
  }

  // 下一曲
  const handleClickNext = () => {
    if (player && playQueue) {
      const next = playQueue[(playQueue.findIndex(item => item.index === current) + 1)]
      // player.pause()
      if (shuffle && next) {
        updateCurrent(next.index)
      }
      if (!shuffle && current + 1 < playQueue?.length)
        updateCurrent(current + 1)
    }
  }

  // 上一曲
  const handleClickPrev = () => {
    if (player && playQueue) {
      const prev = playQueue[(playQueue.findIndex(item => item.index === current) - 1)]
      // player.pause()
      if (shuffle && prev) {
        updateCurrent(prev.index)
      }
      if (!shuffle && current > 0)
        updateCurrent(current - 1)
    }
  }

  /**
   * 快进
   * @param skipTime 
   */
  const handleClickSeekbackward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.max(player.currentTime - skipTime, 0)
    }
  }

  /**
   * 快退
   * @param skipTime 
   */
  const handleClickSeekforward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.min(player.currentTime + skipTime, player.duration)
    }
  }

  /**
   * 跳到指定位置
   * @param seekTime 
   */
  const SeekTo = (seekTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = seekTime
    }
  }

  /**
 * 点击进度条
 * @param current 
 */
  const handleTimeRangeonChange = (current: number | number[]) => {
    if (player && !isNaN(player.duration) && typeof (current) === 'number') {
      updateCurrentTime(player.duration / 1000 * Number(current))
      SeekTo(player.duration / 1000 * Number(current))
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

  // 播放结束时
  const onEnded = () => {
    if (playQueue) {
      const next = playQueue[(playQueue.findIndex(item => item.index === current) + 1)]
      if (repeat === 'one') {
        player?.play()
      } else if (current + 1 === playQueue?.length || !next) { // 播放到队列结束时
        if (repeat === 'all')
          if (shuffle)
            updateCurrent(playQueue[playQueue.findIndex(item => item.index === playQueue[0].index)].index)
          else
            updateCurrent(0)
        else {
          updateIsPlaying(false)
          updateCurrentTime(0)
        }
      } else if (repeat === 'off' || repeat === 'all')
        if (shuffle)
          updateCurrent(next.index)
        else
          updateCurrent(current + 1)
    }
  }

  // 获取 metadata
  useEffect(() => {
    if (type === 'audio' && playQueue !== null) {
      console.log('开始获取 metadata', 'path:', playQueue.filter(item => item.index === current)[0].path)
      const path = playQueue.filter(item => item.index === current)[0].path
      if (metaDataList.some(item => item.path === path)) {
        console.log('跳过获取 metadata', 'path:', path)
      } else {
        try {
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
          })
        } catch (error) {
          console.log('未能获取 metadata', error)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // 根据播放队列和元数据列表更新当前音频元数据
  useEffect(() => {
    if (playQueue && playQueue.length !== 0) {
      const test = metaDataList.filter(metaData => metaData.path === playQueue.filter(item => item.index === current)[0].path)
      console.log('设定当前音频元数据')
      if (test.length !== 0) {
        setMetaData({
          ...test[0],
          size: playQueue.filter(item => item.index === current)[0].size
        })
      } else {
        setMetaData({
          title: playQueue.filter(item => item.index === current)[0].title,
          artist: '',
          path: playQueue.filter(item => item.index === current)[0].path,
        })
      }
    }
  }, [playQueue, current, metaDataList])

  // 设定封面
  useMemo(() => {
    (!playQueue || !metaData || !metaData.cover)
      ? updateCover('./cd.png')
      : updateCover(URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaData?.cover])

  // 向 mediaSession 发送当前播放进度
  useMediaSession(player, cover, metaData?.album, metaData?.artist, metaData?.title,
    handleClickPlay, handleClickPause, handleClickNext, handleClickPrev, handleClickSeekbackward, handleClickSeekforward, SeekTo)

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
        sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'top 0.35s' }}
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
            sx={controlIsShow ? { top: 0, left: 0, borderRadius: '0 0 5px 0', width: 'auto' } : { display: 'none' }}
          >
            <IconButton aria-label="close" onClick={() => {
              updateVideoViewIsShow(false)
              updateControlIsShow(true)
            }} >
              <KeyboardArrowDownOutlinedIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Grid>

        </Grid>

      </Container>
      <Paper
        elevation={0}
        square={true}
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: `0px -4px 4px -2px ${theme.palette.divider}` }}
      // style={(videoViewIsShow) ? { backgroundColor: '#ffffffee' } : { backgroundColor: '#ffffff' }}
      >
        <Container maxWidth={false} disableGutters={true}>
          <div style={(controlIsShow) ? {} : { display: 'none' }}>
            <PlayerControl
              metaData={metaData}
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
            metaData={metaData}
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
          <PlayQueue />
        </Container>
      </Paper >
    </div>
  )
}

export default Player