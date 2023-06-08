import { useMemo, useRef } from 'react'
import PlayerControl from "./PlayerControl"
import { useMetaDataListStore, usePlayListStore, usePlayerStore } from '../../store'
import * as mm from 'music-metadata-browser'

const Player = ({ getFileData }: any) => {

  const [type, playList, index, total, updateIndex, updateTotal] = usePlayListStore((state) => [
    state.type,
    state.playList,
    state.index,
    state.total,
    state.updateIndex,
    state.updateTotal,
  ])

  const [metaDataList, updateMetaDataList] = useMetaDataListStore(
    (state) => [
      state.metaDataList,
      state.updateMetaDataList,
    ]
  )

  const [
    url,
    loop,
    containerIsHiding,
    updatePlaying,
    updateUrl,
  ] = usePlayerStore(
    (state) => [
      state.url,
      state.loop,
      state.containerIsHiding,
      state.updatePlaying,
      state.updateUrl
    ]
  )

  // 声明播放器对象
  const playerRef = useRef<HTMLVideoElement>(null)

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
          console.log('开始获取 metadata', 'path:', playList[index].path, 'url', url)
          const path = playList[index].path
          if (metaDataList.some(item => item.path === path)) {
            console.log('跳过获取 metadata', 'path:', path, metaDataList)
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
                  updateMetaDataList([...metaDataList, metaData])
                  console.log([...metaDataList, metaData])
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
  }, [type, playList, index, url, metaDataList, updateMetaDataList])

  const onEnded = () => {
    if (index + 1 === total) {
      if (loop) updateIndex(0)
      else
        updatePlaying(false)
    } else
      updateIndex(index + 1)
  }

  return (
    <div >
      <div style={
        (containerIsHiding)
          ? { height: 0 }
          : { height: '100vh', width: '100vw', position: 'fixed', top: '0', left: '0', backgroundColor: 'white' }}>
        <video
          width={'100%'}
          height={'100%'}
          src={url}
          autoPlay
          ref={playerRef}
          onEnded={() => onEnded()}
        />
      </div>
      {playerRef.current && <PlayerControl player={playerRef.current} />}
    </div>
  )
}

export default Player