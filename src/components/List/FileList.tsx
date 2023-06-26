import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { fileSizeConvert } from '../../util'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { FileItem } from '../../type'

const FileList = (
  { fileList, handleClickListItem, handleClickDelete }
    : { fileList: FileItem[], handleClickListItem: (filePath: string) => void, handleClickDelete?: (filePathArray: string[]) => void }) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, current: number) => {
    setMenuOpen(true)
    setCurrent(current)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setCurrent(0)
    setAnchorEl(null)
  }

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        {
          handleClickDelete &&
          <MenuItem onClick={() => {
            handleClickDelete([fileList[current].filePath])
            handleCloseMenu()
          }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary='Delete' />
          </MenuItem>
        }
      </Menu>

      <Grid container spacing={1} >
        {
          fileList.map((item, index) =>
            <Grid lg={4} md={6} sm={12} xs={12} >
              <ListItem
                disablePadding
                key={index}
                secondaryAction={
                  (item.fileType === 'audio' || item.fileType === 'video') &&
                  <div>
                    <IconButton
                      aria-label="more"
                      onClick={(event) => handleClickMenu(event, index)}
                    >
                      <MoreVertOutlined />
                    </IconButton>
                  </div>
                }
              >
                <ListItemButton
                  onClick={() => handleClickListItem(item.filePath)}
                >
                  <ListItemIcon>
                    {item.fileType === 'folder' && <FolderIcon />}
                    {item.fileType === 'audio' && <MusicNoteIcon />}
                    {item.fileType === 'video' && <MovieIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.fileName}
                    secondary={fileSizeConvert(item.fileSize)}
                    primaryTypographyProps={{
                      style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                    secondaryTypographyProps={{
                      style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Grid>
          )
        }
      </Grid>
    </div>
  )
}

export default FileList