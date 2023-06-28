import { Button, ListItemText, Typography, Dialog, DialogTitle, DialogActions, Menu, MenuItem, DialogContent, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate, useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import usePlayListsStore from '../../store/usePlayListsStore'
import CommonList from '../CommonList/CommonList'
import { useState } from 'react'
import Loading from '../Loading'
import { filePathConvert } from '../../util'
import { useTranslation } from 'react-i18next'


const PlayList = () => {
  const { t } = useTranslation()
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

  // 从播放列表中移除
  const removePlayListItem = (filePathArray: string[][]) => {
    playListItem &&
      updatePlayListsItem({ ...playListItem, playList: [...playListItem.playList.filter(item => filePathArray.find(filePath => filePathConvert(filePath) !== filePathConvert(item.filePath)))] })
  }

  // 重命名播放列表
  const renamePlayListItem = () => {
    playListItem &&
      updatePlayListsItem({ ...playListItem, title: newTitle })
    setRenameDialogOpen(false)
  }

  // 删除播放列表
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
        (!playListItem)
          ? <Loading />
          : <div>
            <Grid
              container
              sx={{ pt: 3, pl: 2, pr: 2, pb: 2 }}
              alignItems={'baseline'}
              gap={1}
            >
              <Grid xs={12}>
                <Typography variant='h4' noWrap>
                  {playListItem.title}
                </Typography>
              </Grid>
              {/* <Grid xs={'auto'}>
                <Typography variant='body1' noWrap >
                  {playListItem.playList.length} 媒体
                </Typography>
              </Grid> */}
              <Grid xs={'auto'}>
                <Button
                  variant='contained'
                  size='small'
                  // startIcon={<MoreVertOutlined />}
                  onClick={handleClickMenu}
                >
                  {t('common.more')}
                </Button>
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
                <ListItemText primary={t('common.rename')} />
              </MenuItem>
              <MenuItem onClick={() => {
                setDeleteDiaLogOpen(true)
                handleCloseMenu()
              }}>
                <ListItemText primary={t('common.delete')} />
              </MenuItem>
            </Menu>

            {/* 重命名播放列表 */}
            <Dialog
              open={renameDialogOpen}
              onClose={() => setRenameDialogOpen(false)}
              fullWidth
              maxWidth='xs'
            >
              <DialogTitle>{t('common.rename')}</DialogTitle>
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
                <Button onClick={() => setRenameDialogOpen(false)}>{t('common.cancel')}</Button>
                <Button onClick={() => renamePlayListItem()} >{t('common.ok')}</Button>
              </DialogActions>
            </Dialog>

            {/* 删除播放列表 */}
            <Dialog
              open={deleteDiaLogOpen}
              onClose={() => setDeleteDiaLogOpen(false)}
              fullWidth
              maxWidth='xs'
            >
              <DialogContent>
                {t('playlist.playlistWillBeDeleted')}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDiaLogOpen(false)}>{t('common.cancel')}</Button>
                <Button onClick={deletePlayListItem} >{t('common.ok')}</Button>
              </DialogActions>
            </Dialog>

            <CommonList
              fileList={playListItem.playList}
              handleClickRemove={removePlayListItem}
            />
          </div>
      }
    </div>
  )
}

export default PlayList