import { Button, IconButton, ListItem, ListItemText, Typography, Dialog, DialogTitle, DialogActions, Menu, MenuItem, DialogContent, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import { useNavigate, useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import usePlayListsStore from '../../store/usePlayListsStore'
import FileList from './FileList'
import { useState } from 'react'


const PlayList = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [playLists, updatePlayListsItem, removePlayListsItem] = usePlayListsStore((state) => [state.playLists, state.updatePlayListsItem, state.removePlayListsItem], shallow)
  const playListItem = playLists?.find(playListItem => playListItem.id === id)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDiaLogOpen, setDeleteDiaLogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen(true)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  const removePlayListItem = (filePathArray: string[]) => {
    playListItem &&
      updatePlayListsItem({ ...playListItem, playList: [...playListItem.playList.filter(item => filePathArray.find(filePath => filePath !== item.filePath))] })
  }

  const renamePlayListItem = () => {
    playListItem &&
      updatePlayListsItem({ ...playListItem, title: newTitle })
    setRenameDialogOpen(false)
  }

  const deletePlayListItem = () => {
    id &&
      removePlayListsItem(id)
    setDeleteDiaLogOpen(false)
    setNewTitle('')
    return navigate('/')
  }

  return (
    <div>
      {
        (playListItem) &&
        <div>
          <Grid container sx={{ pt: 3, pl: 5, pr: 2, pb: 2 }} justifyContent={{ xs: 'space-between', md: 'flex-start' }} gap={5} >
            <Grid>
              <ListItem
                disablePadding
              >
                <ListItemText
                  primary={
                    <Typography variant='h4' component='div' >
                      {playListItem.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant='body1' component='div' >
                      {playListItem.playList.length} song
                    </Typography>
                  }
                />
              </ListItem>
            </Grid>
            <Grid pt={1}>
              <IconButton onClick={handleClickMenu}>
                <MoreVertOutlined />
              </IconButton>
            </Grid>
          </Grid>

          {/* 菜单 */}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => {
              setRenameDialogOpen(true)
              handleCloseMenu()
            }}>
              <ListItemText primary='Rename' />
            </MenuItem>
            <MenuItem onClick={() => {
              setDeleteDiaLogOpen(true)
              handleCloseMenu()
            }}>
              <ListItemText primary='Delete' />
            </MenuItem>
          </Menu>

          {/* 重命名播放列表 */}
          <Dialog
            open={renameDialogOpen}
            onClose={() => setRenameDialogOpen(false)}
            fullWidth
            maxWidth='xs'
          >
            <DialogTitle>Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                variant="standard"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRenameDialogOpen(false)}>CANCEL</Button>
              <Button onClick={() => renamePlayListItem()} >OK</Button>
            </DialogActions>
          </Dialog>

          {/* 删除播放列表 */}
          <Dialog
            open={deleteDiaLogOpen}
            onClose={() => setDeleteDiaLogOpen(false)}
            fullWidth
            maxWidth='xs'
          >
            <DialogTitle>Delete {playListItem.title}</DialogTitle>
            <DialogContent>

            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDiaLogOpen(false)}>Cancal</Button>
              <Button onClick={deletePlayListItem} >OK</Button>
            </DialogActions>
          </Dialog>

          <FileList
            fileList={playListItem.playList}
            handleClickRemove={removePlayListItem}
          />
        </div>
      }
    </div>
  )
}

export default PlayList