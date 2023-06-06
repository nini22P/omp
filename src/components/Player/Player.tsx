import { useMemo, useRef } from 'react'
import PlayerControl from "./PlayerControl"
import usePlayerStore from '../../store'
import styles from './Player.module.scss'
// import useSWR from 'swr'

const Player = ({ getFileData }: any) => {
  const [type,
    playList,
    index,
    total,
    url,
    loop,
    containerIsHiding,
    updatePlaying,
    updateIndex,
    updateTotal,
    updateUrl,
  ] = usePlayerStore(
    (state) => [
      state.type,
      state.playList,
      state.index,
      state.total,
      state.url,
      state.loop,
      state.containerIsHiding,
      state.updatePlaying,
      state.updateIndex,
      state.updateTotal,
      state.updateUrl,
      state.updateContainerIsHiding
    ]
  )

  const playerRef = useRef<any>(null)

  useMemo(() => {
    if (playList !== null) {
      // 更新播放列表总数
      updateTotal(playList ? playList.length : 0)
      getFileData(playList[index].path).then((res: any) => {
        console.log('开始播放', playList[index].path)
        updateUrl(res['@microsoft.graph.downloadUrl'])
        updatePlaying(true)
      })
    }
  }, [playList, index])

  const onEnded = () => {
    if (index + 1 === total) {
      if (loop) updateIndex(0)
      else
        updatePlaying(false)
    } else
      updateIndex(index + 1)
  }

  return (
    <div className={styles.player}>
      <div className={styles.playerContainer} style={(containerIsHiding) ? { height: 0 } : { height: '100%' }}>
        {(type === 'audio') &&
          <audio
            src={url}
            autoPlay
            ref={playerRef}
            onEnded={() => onEnded()}
          />
        }
        {(type === 'video') &&
          <video
            width={'100%'}
            height={'100%'}
            src={url}
            autoPlay
            ref={playerRef}
            onEnded={() => onEnded()}
          />
        }
      </div>
      <PlayerControl
        playerRef={playerRef}
      />
    </div>
  )
}

export default Player