import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ListItemText, Typography, Dialog, DialogTitle, DialogActions, Menu, MenuItem, DialogContent, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'

const Playlist = () => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()

  const [playlists, renamePlaylist, removePlaylist, removeFilesFromPlaylist] = usePlaylistsStore(
    (state) => [state.playlists, state.renamePlaylist, state.removePlaylist, state.removeFilesFromPlaylist])
  const playlist = playlists?.find(playlistItem => playlistItem.id === id)

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

  //从播放列表移除文件
  const removeFiles = (filePathArray: string[][]) => {
    id && removeFilesFromPlaylist(id, filePathArray)
  }

  // 删除播放列表
  const deletePlaylist = () => {
    if (id && playlists) {
      removePlaylist(id)
      setDeleteDiaLogOpen(false)
      setNewTitle('')
      const prev = playlists[playlists?.findIndex((playlist) => playlist.id === id) - 1]
      const next = playlists[playlists?.findIndex((playlist) => playlist.id === id) + 1]
      const navigateToId = (prev) ? prev.id : (next) ? next.id : null
      return navigate((navigateToId) ? `/playlist/${navigateToId}` : '/')
    }
  }

  return (
    <div>
      {
        (!playlist)
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
                  {playlist.title}
                </Typography>
              </Grid>
              {/* <Grid xs={'auto'}>
                <Typography variant='body1' noWrap >
                  {playlistItem.playlist.length} 媒体
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
                <Button onClick={() => {
                  if (id && newTitle) {
                    renamePlaylist(id, newTitle)
                    setRenameDialogOpen(false)
                  }
                }} >
                  {t('common.ok')}
                </Button>
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
                <Button onClick={deletePlaylist} >{t('common.ok')}</Button>
              </DialogActions>
            </Dialog>

            <CommonList
              listData={playlist.fileList}
              handleClickRemove={removeFiles}
            />
          </div>
      }
    </div>
  )
}

export default Playlist