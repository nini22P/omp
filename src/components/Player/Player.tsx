import { useMemo, useRef, useState } from 'react'
import * as mm from 'music-metadata-browser'
import { Container, IconButton, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import AudioView from './AudioView'
import PlayerControl from './PlayerControl'
import useMetaDataListStore from '../../store/useMetaDataListStore'
import usePlayListStore from '../../store/usePlayListStore'
import usePlayerStore from '../../store/usePlayerStore'
import PlayList from '../PlayList'

const Player = ({ getFileData }: { getFileData: (filePath: string) => Promise<any> }) => {

  const [type, playList, index, total, updateIndex, updateTotal] = usePlayListStore((state) => [
    state.type,
    state.playList,
    state.index,
    state.total,
    state.updateIndex,
    state.updateTotal,
  ])

  const [metaDataList, insertMetaDataList] = useMetaDataListStore(
    (state) => [
      state.metaDataList,
      state.insertMetaDataList,
    ]
  )

  const [
    url,
    loop,
    containerIsHiding,
    updatePlaying,
    updateUrl,
    updateContainerIsHiding,
  ] = usePlayerStore(
    (state) => [
      state.url,
      state.loop,
      state.containerIsHiding,
      state.updatePlaying,
      state.updateUrl,
      state.updateContainerIsHiding
    ]
  )

  // 声明播放器对象
  const playerRef = useRef<HTMLVideoElement>(null)

  //音频界面是否显示
  const [audioViewIsDisplay, setAudioViewIsDisplay] = useState(false)

  // 更新播放列表总数
  useMemo(() => {
    if (playList !== null) {
      updateTotal(playList ? playList.length : 0)
      getFileData(playList[index].path).then((res: any) => {
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

  const onEnded = () => {
    if (index + 1 === total) {
      if (loop) updateIndex(0)
      else
        updatePlaying(false)
    } else
      updateIndex(index + 1)
  }

  return (
    <div>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'all 0.5s' }}
        style={(containerIsHiding) ? { bottom: '-100vh' } : { bottom: '0' }}
      >
        <Grid container
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'start',
            backgroundColor: '#000'
          }}>
          <Grid xs={12}
            sx={{ backgroundColor: '#ffffff9e' }}
          >
            <IconButton aria-label="close" onClick={() => updateContainerIsHiding(true)} >
              <KeyboardArrowDownOutlinedIcon />
            </IconButton>
          </Grid>
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

        </Grid>

      </Container>
      <Paper
        elevation={0}
        square={true}
        sx={{ position: 'fixed', bottom: '0', width: '100%', boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.1), 0px -4px 4px -2px rgba(0, 0, 0, 0.1)' }}
        style={(!containerIsHiding) ? { backgroundColor: '#ffffff9e' } : { backgroundColor: '#ffffff' }}
      >
        <Container
          maxWidth={false}
          disableGutters={true}
        >
          {
            playerRef.current && <div>
              <PlayerControl
                player={playerRef.current}
                setAudioViewIsDisplay={setAudioViewIsDisplay}
              />
              <AudioView
                player={playerRef.current}
                audioViewIsDisplay={audioViewIsDisplay}
                setAudioViewIsDisplay={setAudioViewIsDisplay}
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