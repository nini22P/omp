import styles from './PlayerControl.module.scss'

const PlayerControl = ({ playList, playerStatus, setPlayerStatus, playerRef, handleClickNext, handleClickPrev }: any) => {
  const audioEl = (playerRef.current === null) ? null : playerRef.current.audioEl.current

  const handleClickPlayPause = () => {
    if (audioEl.paused) {
      audioEl.play()
      setPlayerStatus(
        {
          ...playerStatus,
          playing: true,
        }
      )
    }
    else {
      audioEl.pause()
      setPlayerStatus(
        {
          ...playerStatus,
          playing: false,
        }
      )
    }
  }

  return (
    <div className={styles.control}>
      <span>{!playList ? '0 / 0' : `${playerStatus.index + 1} / ${playerStatus.total}`}</span>
      <span>{!playList ? 'Not playing' : playList[playerStatus.index].name}</span>
      <button onClick={handleClickPrev}>Prev</button>
      <button onClick={handleClickPlayPause}>{(playerStatus.playing) ? 'Paluse' : 'Play'}</button>
      <button onClick={handleClickNext}>Next</button>

    </div>
  )
}

export default PlayerControl