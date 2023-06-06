import { FileItem } from "../../type"
import styles from './ListItem.module.scss'

const ListItem = ({ index, name, size, type, handleListClick }: FileItem) => {
  return (
    <div title={name} className={styles.item} onClick={() => handleListClick(index, name, type)}>
      <span className={styles.name}>{name}</span>
      <span>{
        ((size / 1024) < 1024)
          ? `${(size / 1024).toFixed(2)} KB`
          : ((size / 1024 / 1024) < 1024)
            ? `${(size / 1024 / 1024).toFixed(2)} MB`
            : `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`}</span>
    </div>
  )
}

export default ListItem