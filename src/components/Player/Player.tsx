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
import { shallow } from 'zustand/shallow'
import { useControlHide } from '../../hooks/useControlHide'
import { useMediaSession } from '../../hooks/useMediaSession'
import { shufflePlayList } from '../../util'

const Player = ({ getFileData }: { getFileData: (filePath: string) => Promise<any> }) => {

  const [type, playList, current, updateCurrent, updatePlayList] = usePlayListStore(
    (state) => [state.type, state.playList, state.current, state.updateCurrent, state.updatePlayList], shallow)

  const [metaData, setMetaData] = useState<MetaData | null>(null)

  const [metaDataList, insertMetaDataList] = useMetaDataListStore((state) => [state.metaDataList, state.insertMetaDataList], shallow)

  const [shuffle, repeat, updateCurrentTime, updateDuration, updateRepeat] = usePlayerStore(
    (state) => [state.shuffle, state.repeat, state.updateCurrentTime, state.updateDuration, state.updateRepeat], shallow)

  const [videoViewIsShow, controlIsShow, updateVideoViewIsShow, updateControlIsShow, updateFullscreen] = useUiStore(
    (state) => [state.videoViewIsShow, state.controlIsShow, state.updateVideoViewIsShow, state.updateControlIsShow, state.updateFullscreen], shallow)

  const playerRef = (useRef<HTMLVideoElement>(null))
  const player = playerRef.current   // 声明播放器对象
  const [url, setUrl] = useState('')

  // 获取当前播放文件链接
  useMemo(() => {
    if (playList !== null) {
      getFileData(playList.filter(item => item.index === current)[0].path).then((res) => {
        console.log('开始播放', playList.filter(item => item.index === current)[0].path)
        setUrl(res['@microsoft.graph.downloadUrl'])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playList?.filter(item => item.index === current)[0].path])

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

  // 随机
  useEffect(() => {
    if (shuffle && playList) {
      const randomPlayList = shufflePlayList(playList, current)
      updatePlayList(randomPlayList)
    }
    if (!shuffle && playList) {
      updatePlayList([...playList].sort((a, b) => a.index - b.index))
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
    if (player && playList) {
      const next = playList[(playList.findIndex(item => item.index === current) + 1)]
      // player.pause()
      if (shuffle && next) {
        updateCurrent(next.index)
      }
      if (!shuffle && current + 1 < playList?.length)
        updateCurrent(current + 1)
    }
  }

  // 上一曲
  const handleClickPrev = () => {
    if (player && playList) {
      const prev = playList[(playList.findIndex(item => item.index === current) - 1)]
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

  // 播放结束
  const onEnded = () => {
    if (playList) {
      const next = playList[(playList.findIndex(item => item.index === current) + 1)]
      if (repeat === 'one') {
        player?.play()
      } else if (current + 1 === playList?.length || !next) {
        if (repeat === 'all')
          if (shuffle)
            updateCurrent(playList[playList.findIndex(item => item.index === playList[0].index)].index)
          else
            updateCurrent(0)
      } else if (repeat === 'off' || repeat === 'all')
        if (shuffle)
          updateCurrent(next.index)
        else
          updateCurrent(current + 1)
    }
  }

  // 获取 metadata
  useMemo(() => {
    if (playerRef.current !== null) {
      playerRef.current.onplay = () => {
        if (type === 'audio' && playList !== null) {
          console.log('开始获取 metadata', 'path:', playList.filter(item => item.index === current)[0].path)
          const path = playList.filter(item => item.index === current)[0].path
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // 根据播放列表和元数据列表更新当前音频元数据
  useEffect(() => {
    if (playList) {
      const test = metaDataList.filter(metaData => metaData.path === playList.filter(item => item.index === current)[0].path)
      console.log('设定当前音频元数据')
      if (test.length === 1) {
        setMetaData({
          ...test[0],
          size: playList.filter(item => item.index === current)[0].size
        })
      } else {
        setMetaData({
          title: playList.filter(item => item.index === current)[0].title,
          artist: '',
          path: playList.filter(item => item.index === current)[0].path,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playList?.filter(item => item.index === current)[0].path, metaDataList])

  // 设定封面
  const cover = useMemo(() => {
    return (!playList || !metaData || !metaData.cover)
      ? './cd.png'
      : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaData])

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
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: '0px -4px 4px -2px rgba(0, 0, 0, 0.1)' }}
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