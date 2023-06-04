import styles from './Player.module.scss'
import PlayerController from "./PlayerController"

const Player = ({ playList }: any) => {
  return (
    <div className={styles.player}>
      <PlayerController playList={playList} />
    </div>
  )
}

export default Player