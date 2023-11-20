import { useEffect, useMemo, useRef, useState } from 'react'
import * as mm from 'music-metadata-browser'
import { Box, Container, IconButton, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import useHistoryStore from '../../store/useHistoryStore'
import useUiStore from '../../store/useUiStore'
import useMetaDataListStore from '../../store/useMetaDataListStore'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import { useControlHide } from '../../hooks/useControlHide'
import { useMediaSession } from '../../hooks/useMediaSession'
import useFilesData from '../../hooks/useFilesData'
import useTheme from '../../hooks/useTheme'
import Audio from './Audio/Audio'
import PlayerControl from './PlayerControl'
import PlayQueue from './PlayQueue'
import { filePathConvert, shufflePlayQueue } from '../../utils'
import { MetaData } from '../../types/MetaData'

const Player = () => {

  const { styles } = useTheme()
  const [metaData, setMetaData] = useState<MetaData | null>(null)

  const { getFileData } = useFilesData()

  const [type, playQueue, currentIndex, updateCurrentIndex, updatePlayQueue] = usePlayQueueStore(
    (state) => [state.type, state.playQueue, state.currentIndex, state.updateCurrentIndex, state.updatePlayQueue])

  const [metaDataList, insertMetaDataList] = useMetaDataListStore((state) => [state.metaDataList, state.insertMetaDataList])

  const [playStatu, cover, shuffle, repeat, updatePlayStatu, updateCover, updateCurrentTime, updateDuration, updateRepeat] = usePlayerStore(
    (state) => [state.playStatu, state.cover, state.shuffle, state.repeat, state.updatePlayStatu, state.updateCover, state.updateCurrentTime, state.updateDuration, state.updateRepeat])

  const [videoViewIsShow, controlIsShow, updateVideoViewIsShow, updateControlIsShow, updateFullscreen] = useUiStore(
    (state) => [state.videoViewIsShow, state.controlIsShow, state.updateVideoViewIsShow, state.updateControlIsShow, state.updateFullscreen])

  const insertHistory = useHistoryStore((state) => state.insertHistory)

  const playerRef = (useRef<HTMLVideoElement>(null))
  const player = playerRef.current   // 声明播放器对象
  const [url, setUrl] = useState('')

  // 获取当前播放文件链接
  useMemo(
    () => {
      if (playQueue !== null && playQueue.length !== 0) {
        try {
          getFileData(filePathConvert(playQueue.filter(item => item.index === currentIndex)[0].filePath)).then((res) => {
            setUrl(res['@microsoft.graph.downloadUrl'])
            updatePlayStatu('waiting')
          })
        } catch (error) {
          console.error(error)
          updatePlayStatu('paused')
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playQueue?.find(item => item.index === currentIndex)?.filePath]
  )

  useMemo(
    () => {
      if (player !== null && playQueue) {
        updateDuration(0)
        player.load()
        player.onloadedmetadata = () => {
          if (type === 'video') {
            updateVideoViewIsShow(true) //类型是视频时打开视频播放
          }
          updatePlayStatu('playing')
          updateDuration(player.duration)
          const currentItem = playQueue.filter(item => item.index === currentIndex)[0]
          insertHistory({
            fileName: currentItem.fileName,
            filePath: currentItem.filePath,
            fileSize: currentItem.fileSize,
            fileType: currentItem.fileType,
          })
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

  // 播放开始暂停
  useEffect(
    () => {
      if (playStatu === 'playing') {
        console.log('开始播放', playQueue?.filter(item => item.index === currentIndex)[0].filePath)
        if (playQueue?.filter(item => item.index === currentIndex)[0].filePath)
          player?.play()
        else {
          updatePlayStatu('paused')
        }
      }
      if (playStatu === 'paused')
        player?.pause()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playStatu]
  )

  // 随机
  useEffect(
    () => {
      if (shuffle && playQueue) {
        const randomPlayQueue = shufflePlayQueue(playQueue, currentIndex)
        updatePlayQueue(randomPlayQueue)
      }
      if (!shuffle && playQueue) {
        updatePlayQueue([...playQueue].sort((a, b) => a.index - b.index))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shuffle]
  )

  // 设置当前播放进度
  useEffect(
    () => {
      if (player)
        player.ontimeupdate = () => {
          updateCurrentTime(player.currentTime)
        }
    },
    [player, updateCurrentTime]
  )

  // 播放视频时自动隐藏ui
  useControlHide(type, videoViewIsShow)

  // 播放开始
  const handleClickPlay = () => {
    updatePlayStatu('playing')
  }

  // 播放暂停
  const handleClickPause = () => {
    updatePlayStatu('paused')
  }

  // 下一曲
  const handleClickNext = () => {
    if (player && playQueue) {
      const next = playQueue[(playQueue.findIndex(item => item.index === currentIndex) + 1)]
      // player.pause()
      if (shuffle && next) {
        updateCurrentIndex(next.index)
      }
      if (!shuffle && currentIndex + 1 < playQueue?.length)
        updateCurrentIndex(currentIndex + 1)
    }
  }

  // 上一曲
  const handleClickPrev = () => {
    if (player && playQueue) {
      const prev = playQueue[(playQueue.findIndex(item => item.index === currentIndex) - 1)]
      // player.pause()
      if (shuffle && prev) {
        updateCurrentIndex(prev.index)
      }
      if (!shuffle && currentIndex > 0)
        updateCurrentIndex(currentIndex - 1)
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
      const next = playQueue[(playQueue.findIndex(item => item.index === currentIndex) + 1)]
      if (repeat === 'one') {
        player?.play()
      } else if (currentIndex + 1 === playQueue?.length || !next) { // 播放到队列结束时
        if (repeat === 'all')
          if (shuffle)
            updateCurrentIndex(playQueue[playQueue.findIndex(item => item.index === playQueue[0].index)].index)
          else
            updateCurrentIndex(0)
        else {
          updatePlayStatu('paused')
          updateCurrentTime(0)
        }
      } else if (repeat === 'off' || repeat === 'all')
        if (shuffle)
          updateCurrentIndex(next.index)
        else
          updateCurrentIndex(currentIndex + 1)
    }
  }

  // 获取 metadata
  useEffect(
    () => {
      if (type === 'audio' && playQueue !== null) {
        const path = playQueue.filter(item => item.index === currentIndex)[0].filePath
        console.log('开始获取 metadata', path)
        if (metaDataList.some(item => filePathConvert(item.path) === filePathConvert(path))) {
          console.log('跳过获取 metadata')
        } else {
          try {
            mm.fetchFromUrl(url).then(metadata => {
              if (metadata) {
                if (metadata.common.title !== undefined) {
                  console.log('获取 metadata')
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

  // 更新当前 metadata
  useEffect(
    () => {
      if (playQueue && playQueue.length !== 0) {
        const test = metaDataList
          .filter(metaData =>
            filePathConvert(metaData.path) === filePathConvert(playQueue.filter(item => item.index === currentIndex)[0].filePath))
        console.log('设定当前 metadata', test)
        if (test.length !== 0) {
          setMetaData({
            ...test[0],
            size: playQueue.filter(item => item.index === currentIndex)[0].fileSize
          })
          if (test[0].cover)
            if (test[0].cover[0].data)
              updateCover(URL.createObjectURL(new Blob([new Uint8Array(test[0].cover[0].data)], { type: 'image/png' })))
            else
              updateCover('./cover.png')
          else
            updateCover('./cover.png')
        } else {
          setMetaData({
            title: playQueue.filter(item => item.index === currentIndex)[0].fileName,
            artist: '',
            path: playQueue.filter(item => item.index === currentIndex)[0].filePath,
          })
          updateCover('./cover.png')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playQueue?.find(item => item.index === currentIndex)?.filePath, metaDataList]
  )

  // 向 mediaSession 发送当前播放进度
  useMediaSession(player, cover, metaData?.album, metaData?.artist, metaData?.title,
    handleClickPlay, handleClickPause, handleClickNext, handleClickPrev, handleClickSeekbackward, handleClickSeekforward, SeekTo)

  // 检测全屏
  useEffect(() => {
    const handleFullscreenChange = () => {
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
          }}
        >
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
            className='pt-titlebar-area-height'
          >
            <IconButton
              aria-label="close"
              onClick={() => {
                updateVideoViewIsShow(false)
                updateControlIsShow(true)
              }}
              className='app-region-no-drag'
            >
              <KeyboardArrowDownOutlinedIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Grid>

        </Grid>

      </Container>
      <Paper
        elevation={0}
        square={true}
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: `0px -2px 2px -1px ${styles.color.shadow}` }}
      // style={(videoViewIsShow) ? { backgroundColor: '#ffffffee' } : { backgroundColor: '#ffffff' }}
      >
        <Container maxWidth={false} disableGutters={true}>
          <Box sx={(controlIsShow) ? {} : { display: 'none' }}>
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
          </Box>
          <Audio
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