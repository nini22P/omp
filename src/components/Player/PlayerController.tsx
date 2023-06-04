import styles from './PlayerController.module.scss'

const PlayerController = ({ playList }: any) => {
  console.log(playList)
  return (
    <div className={styles.controller}>
    </div>
  )
}

export default PlayerController