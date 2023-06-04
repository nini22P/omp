import styles from './ListNav.module.scss'

const ListNav = ({ folderTree, handleListNavClick }: any) => {
  return (
    <div className={styles.nav}>
      {folderTree.map(
        (name: string, index: number) =>
          <button
            key={index}
            onClick={() => handleListNavClick(index)}
          >
            {name}
          </button>)}
    </div>
  )
}

export default ListNav