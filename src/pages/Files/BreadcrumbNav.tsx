import { Breadcrumbs, Button } from '@mui/material'
import useUiStore from '../../store/useUiStore'

const BreadcrumbNav = () => {

  const [folderTree, updateFolderTree] = useUiStore((state) => [state.folderTree, state.updateFolderTree])

  const handleListNavClick = (index: number) => updateFolderTree(folderTree.slice(0, index + 1))

  return (
    <Breadcrumbs
      separator="›"
      sx={{
        m: '0.5rem',
      }}>
      {
        folderTree.map((name: string, index: number) =>
          <Button
            key={index}
            color="inherit"
            size='small'
            onClick={() => handleListNavClick(index)}
          >

            <span style={{
              maxWidth: '10rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 'auto',
            }}>
              {name}
            </span>

          </Button>
        )
      }
    </Breadcrumbs>
  )
}

export default BreadcrumbNav