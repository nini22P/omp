import { FileItem } from "../../type"
import ListItem from "./ListItem"
import ListNav from "./ListNav"
import styles from './ListView.module.scss'

const ListView = ({ folderTree, fileList, handleListClick, handleListNavClick }: any) => {
  if (fileList === null) return null
  return (
    <div>
      <div className={styles.listNavContainer}>
        <ListNav folderTree={folderTree} handleListNavClick={handleListNavClick} />
      </div>
      <div className={styles.fileList}>
        {fileList.map((item: FileItem, index: number) =>
          <ListItem index={index} name={item.name} size={item.size} type={item.type} key={index} handleListClick={handleListClick} />)
        }
      </div>

    </div>
  )
}

export default ListView