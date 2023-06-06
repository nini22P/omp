import { useEffect, useMemo, useRef } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import PlayerControl from "./PlayerControl"
import usePlayerStore from '../../store'
import styles from './Player.module.scss'
// import useSWR from 'swr'

const Player = ({ getFileData }: any) => {
  const [playList, index, total, url, loop, updatePlaying, updateIndex, updateTotal, updateUrl] = usePlayerStore(
    (state) => [
      state.playList,
      state.index,
      state.total,
      state.url,
      state.loop,
      state.updatePlaying,
      state.updateIndex,
      state.updateTotal,
      state.updateUrl]
  )
  console.log('播放器获取到的播放列表', playList)

  const playerRef = useRef<ReactAudioPlayer | null>(null)
  const filePath = (playList === null) ? null : playList[index].path

  useMemo(() => {
    if (filePath !== null) {
      getFileData(filePath).then((res: any) => {
        console.log('开始播放', filePath)
        updateUrl(res['@microsoft.graph.downloadUrl'])
        updatePlaying(true)
      })
    }
  }, [filePath, index])

  useEffect(() => {
    if (playList !== null) {
      updateTotal(playList ? playList.length : 0)
    }
  }, [playList])

  return (
    <div className={styles.player}>
      <div className={styles.playerContainer}>
        <ReactAudioPlayer
          src={url}
          autoPlay
          controls
          ref={playerRef}
          onLoadedMetadata={res => console.log(res)}
          onEnded={() => {
            if (index + 1 === total) {
              if (loop) updateIndex(0)
              else
                updatePlaying(false)
            } else
              updateIndex(index + 1)
          }}
        />
      </div>
      <PlayerControl
        playerRef={playerRef}
      />
    </div>
  )
}

export default Player