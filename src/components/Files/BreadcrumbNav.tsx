import { Breadcrumbs, Button } from '@mui/material'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'

const BreadcrumbNav = () => {
  const [folderTree, updateFolderTree] = useUiStore((state) => [state.folderTree, state.updateFolderTree], shallow)

  const handleListNavClick = (index: number) => updateFolderTree(folderTree.slice(0, index + 1))

  return (
    <Breadcrumbs separator="›" sx={{ m: '0.5rem' }}>
      {
        folderTree.map((name: string, index: number) =>
          <Button key={index} color="inherit" onClick={() => handleListNavClick(index)} >
            {name}
          </Button>
        )
      }
    </Breadcrumbs>
  )
}

export default BreadcrumbNav