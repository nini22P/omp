import ListItem from "./ListItem"
import ListNav from "./ListNav"
import styles from './ListView.module.scss'

const ListView = ({ folderTree, fileList, handleListClick, handleListNavClick }: any) => {
  console.log(fileList)
  if (fileList === null) return null
  return (
    <div>
      <div className={styles.listNavContainer}>
        <ListNav folderTree={folderTree} handleListNavClick={handleListNavClick} />
      </div>
      <div className={styles.fileList}>
        {fileList.map((item: any, index: number) =>
          <ListItem index={index} name={item.name} size={item.size} type={(item.file) ? 'file' : 'folder'} key={item.id} handleListClick={handleListClick} />)
        }
      </div>

    </div>
  )
}

export default ListView