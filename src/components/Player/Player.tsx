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

  const [type, playList, index, updateIndex] = usePlayListStore((state) => [
    state.type,
    state.playList,
    state.index,
    state.updateIndex,
  ])

  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [metaDataList, insertMetaDataList] = useMetaDataListStore(
    (state) => [
      state.metaDataList,
      state.insertMetaDataList,
    ])

  const [
    url,
    loop,
    updatePlaying,
    updateUrl,
    updateCurrentTime,
    updateDuration,
  ] = usePlayerStore((state) => [
    state.url,
    state.loop,
    state.updatePlaying,
    state.updateUrl,
    state.updateCurrentTime,
    state.updateDuration,
  ])

  const [videoViewIsShow, updateVideoViewIsShow] = useUiStore((state) => [state.videoViewIsShow, state.updateVideoViewIsShow,])

  // 声明播放器对象
  const playerRef = useRef<HTMLVideoElement>(null)
  const player = playerRef.current

  // 获取当前播放文件链接并开始播放
  useMemo(() => {
    if (playList !== null) {
      getFileData(playList[index].path).then((res) => {
        console.log('开始播放', playList[index].path)
        updateUrl(res['@microsoft.graph.downloadUrl'])
        updatePlaying(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playList, index])

  // 获取 metadata
  useMemo(() => {
    if (playerRef.current !== null) {
      playerRef.current.onplay = () => {
        if (type === 'audio' && playList !== null) {
          console.log('开始获取 metadata', 'path:', playList[index].path)
          const path = playList[index].path
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
  }, [type, playList, index, url, metaDataList, insertMetaDataList])

  /**
* 播放开始暂停
*/
  const handleClickPlayPause = () => {
    if (player && !isNaN(player.duration)) {
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
    if (player && index + 1 !== playList?.length) {
      player.pause()
      updateIndex(index + 1)
    }
  }

  /**
   * 上一曲
   */
  const handleClickPrev = () => {
    if (player && index !== 0) {
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
    if (player && target && !isNaN(player.duration)) {
      player.currentTime = player.duration / 1000 * Number(target.value)
      player.play()
      updatePlaying(true)
    }
  }

  // 播放结束
  const onEnded = () => {
    if (index + 1 === playList?.length) {
      if (loop) updateIndex(0)
      else
        updatePlaying(false)
    } else
      updateIndex(index + 1)
  }

  useEffect(() => {
    if (playList) {
      const test = metaDataList.filter(metaData => metaData.path === playList[index].path)
      console.log('设定当前音频元数据')
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

  // 设定封面
  const cover = useMemo(() => {
    return (!playList || !metaData || !metaData.cover)
      ? './cd.png'
      : URL.createObjectURL(new Blob([new Uint8Array(metaData.cover[0].data)], { type: 'image/png' }))
  }, [playList, metaData])

  // 添加 mediaSession
  useMemo(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: metaData?.title,
      artist: metaData?.artist,
      album: metaData?.album,
      artwork: [{ src: cover }]
    })
    navigator.mediaSession.setActionHandler('play', () => handleClickPlayPause())
    navigator.mediaSession.setActionHandler('pause', () => handleClickPlayPause())
    navigator.mediaSession.setActionHandler('nexttrack', () => handleClickNext())
    navigator.mediaSession.setActionHandler('previoustrack', () => handleClickPrev())
    return () => {
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('nexttrack', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cover, metaData?.album, metaData?.artist, metaData?.title])

  // 设置当前播放进度
  useEffect(() => {
    if (player)
      player.ontimeupdate = () => {
        updateCurrentTime(player.currentTime)
      }
  }, [player, updateCurrentTime])

  // 加载完毕后立即播放并更新总时长
  useEffect(() => {
    if (player)
      player.onloadedmetadata = () => {
        player.play()
        updateDuration(player.duration)
        if (type === 'video')
          updateVideoViewIsShow(true)
      }
  }, [player, type, updateVideoViewIsShow, updateDuration])

  return (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'all 0.5s' }}
        style={(videoViewIsShow) ? { bottom: '0' } : { bottom: '-100vh' }}
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
            />
          </Grid>

          <Grid xs={12}
            position={'absolute'}
            top={0}
            sx={{ backgroundColor: '#ffffff9e' }}
          >
            <IconButton aria-label="close" onClick={() => updateVideoViewIsShow(false)} >
              <KeyboardArrowDownOutlinedIcon />
            </IconButton>
          </Grid>

        </Grid>

      </Container>
      <Paper
        elevation={0}
        square={true}
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.1), 0px -4px 4px -2px rgba(0, 0, 0, 0.1)' }}
        style={(videoViewIsShow) ? { backgroundColor: '#ffffff9e' } : { backgroundColor: '#ffffff' }}
      >
        <Container
          maxWidth={false}
          disableGutters={true}
        >
          {
            playerRef.current && <div>
              <PlayerControl
                player={playerRef.current}
                metaData={metaData}
                cover={cover}
                handleClickPlayPause={handleClickPlayPause}
                handleClickNext={handleClickNext}
                handleClickPrev={handleClickPrev}
                handleTimeRangeOnInput={handleTimeRangeOnInput}
              />
              <AudioView
                metaData={metaData}
                cover={cover}
                handleClickPlayPause={handleClickPlayPause}
                handleClickNext={handleClickNext}
                handleClickPrev={handleClickPrev}
                handleTimeRangeOnInput={handleTimeRangeOnInput}
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