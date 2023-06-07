import { useEffect } from 'react'
import usePlayerStore from '../../store'
import styles from './PlayerControl.module.scss'

const PlayerControl = ({ playerRef }: any) => {

  const [
    playList,
    index,
    total,
    playing,
    currentTime,
    duration,
    containerIsHiding,
    updatePlaying,
    updateIndex,
    updateCurrentTime,
    updateDuration,
    updateContainerIsHiding
  ] = usePlayerStore(
    (state) => [
      state.playList,
      state.index,
      state.total,
      state.playing,
      state.currentTime,
      state.duration,
      state.containerIsHiding,
      state.updatePlaying,
      state.updateIndex,
      state.updateCurrentTime,
      state.updateDuration,
      state.updateContainerIsHiding,
    ]
  )

  // 获取播放器实例
  const player = (playerRef.current === null) ? null : playerRef.current

  // 更新当前播放进度
  useEffect(() => {
    if (player !== null) {
      player.ontimeupdate = () => {
        updateCurrentTime(player.currentTime)
      }
      player.onloadedmetadata = () => {
        updateDuration(player.duration)
        player.play()
      }
    }
  }, [player])
  /**
   * 播放暂停
   */
  const handleClickPlayPause = () => {
    if (player.paused) {
      player.play()
      updatePlaying(true)
    }
    else {
      player.pause()
      updatePlaying(false)
    }
  }

  /**
 * 下一曲
 */
  const handleClickNext = () => {
    if (index + 1 !== total) {
      player.pause()
      updateIndex(index + 1)
    }
  }

  /**
   * 上一曲
   */
  const handleClickPrev = () => {
    if (index !== 0) {
      player.pause()
      updateIndex(index - 1)
    }
  }

  const handleTimeRangeOnInput = (e: any) => {
    player.currentTime = duration / 1000 * e.target.value
    player.play()
    updatePlaying(true)
  }

  const timeShift = (time: number) => {
    const minute = Number((time / 60).toFixed())
    const second = Number((time % 60).toFixed())
    return `${(minute < 10) ? '0' + minute : minute} : ${(second < 10) ? '0' + second : second}`
  }

  return (
    <div className={styles.control}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '3rem' }}>
        <span>{timeShift(currentTime)}</span>
        <input
          type='range'
          style={{ width: '30rem' }} min={0} max={1000} value={(duration === 0) ? 0 : currentTime / duration * 1000}
          onInput={(e) => handleTimeRangeOnInput(e)}
        />
        <span>{timeShift(duration)}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
        <span>{!playList ? '0 / 0' : `${index + 1} / ${total}`}</span>
        <span>{!playList ? 'Not playing' : playList[index].name}</span>
        <button onClick={handleClickPrev}>Prev</button>
        <button onClick={handleClickPlayPause}>{(playing) ? 'Pause' : 'Play'}</button>
        <button onClick={handleClickNext}>Next</button>
        <button onClick={() => updateContainerIsHiding(!containerIsHiding)}>{containerIsHiding ? 'Display' : 'hide'}</button>
      </div>

    </div>
  )
}

export default PlayerControl