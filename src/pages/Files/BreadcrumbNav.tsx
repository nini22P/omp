import { Breadcrumbs, Button } from '@mui/material'
import { UiState } from '@/types/ui'

const BreadcrumbNav = ({ folderTree, handleClickNav }: { folderTree: UiState['folderTree'], handleClickNav: (index: number) => void }) => {

  return (
    <Breadcrumbs
      separator="›"
      sx={{
        m: '0.25rem',
      }}>
      {
        ['/', ...folderTree].map((name: string, index: number) =>
          <Button
            key={index}
            color="inherit"
            size='small'
            onClick={() => handleClickNav(index)}
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