import { FileItem } from "../../type"
import styles from './ListItem.module.scss'

const ListItem = ({ index, name, size, type, handleListClick }: FileItem) => {
  const fileSizeMB = (size / 1024 / 1024).toFixed(1)
  const fileSizeGB = (size / 1024 / 1024 / 1024).toFixed(1)

  return (
    <div className={styles.item} onClick={() => handleListClick(index, name, type)}>
      <span className={styles.name}>{name}</span>
      <span>{(Number(fileSizeMB) < 1024) ? `${fileSizeMB} MB` : `${fileSizeGB} GB`}</span>
    </div>
  )
}

export default ListItem