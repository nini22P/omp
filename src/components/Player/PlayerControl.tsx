import usePlayerStore from '../../store'
import styles from './PlayerControl.module.scss'

const PlayerControl = ({ playerRef }: any) => {

  const [playList, index, total, playing, updatePlaying, updateIndex] = usePlayerStore(
    (state) => [
      state.playList,
      state.index,
      state.total,
      state.playing,
      state.updatePlaying,
      state.updateIndex,
    ]
  )

  // 获取音频播放器实例
  const audioEl = (playerRef.current === null) ? null : playerRef.current.audioEl.current

  /**
   * 播放暂停
   */
  const handleClickPlayPause = () => {
    if (audioEl.paused) {
      audioEl.play()
      updatePlaying(true)
    }
    else {
      audioEl.pause()
      updatePlaying(false)
    }
  }

  /**
 * 下一曲
 */
  const handleClickNext = () => {
    if (index + 1 !== total) {
      updateIndex(index + 1)
    }
  }

  /**
   * 上一曲
   */
  const handleClickPrev = () => {
    if (index !== 0) {
      updateIndex(index - 1)
    }
  }

  return (
    <div className={styles.control}>
      <span>{!playList ? '0 / 0' : `${index + 1} / ${total}`}</span>
      <span>{!playList ? 'Not playing' : playList[index].name}</span>
      <button onClick={handleClickPrev}>Prev</button>
      <button onClick={handleClickPlayPause}>{(playing) ? 'Pause' : 'Play'}</button>
      <button onClick={handleClickNext}>Next</button>
    </div>
  )
}

export default PlayerControl