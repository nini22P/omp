import ReactPlayer from 'react-player'
import { PLayerStatus, PlayList } from '../../type'
import styles from './Player.module.scss'
import PlayerControl from "./PlayerControl"
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
// import useSWR from 'swr'

const Player = ({ playList, getFileData, currentTarckIndex }: any) => {
  console.log('播放器获取到的播放列表', playList)
  const [playerStatus, setPlayerStatus] = useState<PLayerStatus>({
    type: 'audio',
    index: currentTarckIndex,
    total: 0,
    url: '',
    playing: true,
    loop: false,
    light: true,
    muted: false,
    progress: 0,
    duration: 0,
    containerIsHiding: false,
  })

  console.log(playerStatus)

  const playerRef = useRef<ReactAudioPlayer | null>(null)

  const filePath = (playList === null) ? null : playList[playerStatus.index].path

  console.log('当前播放媒体路径', filePath)

  useMemo(() => {
    if (filePath !== null) {
      getFileData(filePath).then((res: any) => {
        console.log('开始播放', filePath)
        setPlayerStatus({
          ...playerStatus,
          url: res['@microsoft.graph.downloadUrl'],
          total: playList.length,
        })
      })
    }
  }, [filePath, currentTarckIndex])

  useEffect(() => {
    if (playList !== null) {
      // console.log('获取长度', playList.length)
      setPlayerStatus({
        ...playerStatus,
        total: playList.length,
      })
    }
  }, [playList])

  /**
   * 下一曲
   */
  const handleClickNext = () => {
    if (playerStatus.index + 1 !== playerStatus.total) {
      setPlayerStatus(
        {
          ...playerStatus,
          index: playerStatus.index + 1
        }
      )
    }
  }

  /**
   * 上一曲
   */
  const handleClickPrev = () => {
    if (playerStatus.index === 0) {
      setPlayerStatus(
        {
          ...playerStatus,
          index: playerStatus.total,
        }
      )
    }
    else
      setPlayerStatus(
        {
          ...playerStatus,
          index: playerStatus.index - 1,
        }
      )
  }

  return (
    <div className={styles.player}>
      <div className={styles.playerContainer}>
        <ReactAudioPlayer
          src={playerStatus.url}
          autoPlay
          controls
          ref={playerRef}
          onLoadedMetadata={res => console.log(res)}
          onEnded={() => {
            if (playerStatus.index + 1 === playerStatus.total) {
              if (playerStatus.loop)
                setPlayerStatus(
                  {
                    ...playerStatus,
                    index: 0
                  }
                )
            } else
              setPlayerStatus(
                {
                  ...playerStatus,
                  index: playerStatus.index + 1
                }
              )
          }
          }
        />
        {/* <ReactPlayer
          url={playerStatus.url}
          playing={playerStatus.playing}
          loop={playerStatus.loop}
          light={playerStatus.light}
          width='100%'
          height='100%'
        // controls={true}
        /> */}
      </div>
      <PlayerControl
        playList={playList}
        playerStatus={playerStatus}
        setPlayerStatus={setPlayerStatus}
        playerRef={playerRef}
        handleClickPrev={handleClickPrev}
        handleClickNext={handleClickNext}
      />
    </div>
  )
}

export default Player