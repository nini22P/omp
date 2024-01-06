import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ListItemText, Typography, Dialog, DialogTitle, DialogActions, Menu, MenuItem, DialogContent, TextField, Box, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'
import useLocalMetaDataStore from '@/store/useLocalMetaDataStore'
import { MetaData } from '@/types/MetaData'

const Playlist = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()

  const [playlists, renamePlaylist, removePlaylist, removeFilesFromPlaylist] = usePlaylistsStore(
    (state) => [state.playlists, state.renamePlaylist, state.removePlaylist, state.removeFilesFromPlaylist])
  const playlist = playlists?.find(playlistItem => playlistItem.id === id)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDiaLogOpen, setDeleteDiaLogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const { getManyLocalMetaData } = useLocalMetaDataStore()
  const [metaDataList, setMetaDataList] = useState<MetaData[]>([])

  useEffect(
    () => {
      getManyLocalMetaData(playlist?.fileList.slice(0, 10).map(file => file.filePath) || [])
        .then(metaDataList => metaDataList && setMetaDataList(metaDataList.filter(metaData => metaData)))
      return () => {
        setMetaDataList([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlist]
  )

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
    <Box sx={{ height: '100%' }}>
      {
        (!playlist)
          ? <Loading />
          : <Grid container sx={{ flexDirection: 'column', height: '100%' }}>
            <Grid
              container
              sx={{ position: 'relative' }}
              alignItems={'baseline'}
              gap={1}
            >
              <Grid xs={12} container
                sx={{
                  padding: '3rem 1rem 1rem 1rem',
                  background: `linear-gradient(0deg, ${theme.palette.background.default}ff, ${theme.palette.background.default}99,${theme.palette.background.default}00)`,
                  zIndex: 1,
                  gap: '0.25rem',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Grid xs={12}>
                  <Typography variant='h4' noWrap>
                    {playlist.title}
                  </Typography>
                </Grid>
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

              <Box sx={{ position: 'absolute', height: '100%', width: '100%' }}>
                {
                  metaDataList[0] && metaDataList[0].cover && 'data' in metaDataList[0].cover[0].data &&
                  <img
                    src={URL.createObjectURL(new Blob([new Uint8Array(metaDataList[0].cover[0].data.data as unknown as ArrayBufferLike)], { type: 'image/png' }))}
                    alt='Cover'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                }
              </Box>
            </Grid>

            <Grid sx={{ flexGrow: 1 }}>
              <CommonList
                listData={playlist.fileList}
                listType='playlist'
                func={{ handleClickRemove: removeFiles }}
              />
            </Grid>

          </Grid>
      }

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

    </Box>
  )
}

export default Playlist