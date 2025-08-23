import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ListItemText, Typography, Dialog, DialogTitle, DialogActions, Menu, MenuItem, DialogContent, TextField, Box, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'
import { MetaData } from '@/types/metaData'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { checkFileType } from '@/utils'
import { useShallow } from 'zustand/shallow'
import { useLingui } from '@lingui/react/macro'
import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'

const Playlist = () => {
  const { t } = useLingui()

  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()

  const { account } = useUser()
  const db = useDb(account)

  const [shuffle, updateVideoViewIsShow, updateShuffle,] = useUiStore(
    useShallow((state) => [state.shuffle, state.updateVideoViewIsShow, state.updateShuffle])
  )

  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const updateAutoPlay = usePlayerStore(state => state.updateAutoPlay)

  const [playlists, renamePlaylist, removePlaylist, removeFilesFromPlaylist] = usePlaylistsStore(
    useShallow((state) => [state.playlists, state.renamePlaylist, state.removePlaylist, state.removeFilesFromPlaylist])
  )

  const playlist = playlists?.find(item => item.id === id) //当前播放列表

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDiaLogOpen, setDeleteDiaLogOpen] = useState(false)
  const [newName, setNewName] = useState(playlist?.name)
  const [metaDatas, setMetaDatas] = useState<MetaData[]>([])

  useEffect(
    () => {
      (async () => {
        if (!db) return
        const _metaDatas = await db.metadata.bulkGet(playlist?.files.map(file => file.id) || [])
        setMetaDatas(_metaDatas.filter(metaData => metaData !== undefined))
      })()
      return () => {
        setMetaDatas([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlist]
  )

  const open = async (index: number) => {
    const listData = playlist?.files
    if (listData) {
      const currentFile = listData[index]
      if (currentFile) {
        const list = listData
          .map((item, _index) => ({ track: item, index: _index }))
        if (shuffle) {
          updateShuffle(false)
        }
        updatePlayQueue(list)
        updateCurrentIndex(list[index].index)
        updateAutoPlay(true)
        if (checkFileType(currentFile.name) === 'video') {
          updateVideoViewIsShow(true)
        }
      }
    }
  }

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen(true)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false)
    setNewName(playlist?.name)
  }

  //从播放列表移除文件
  const remove = async (indexArray: number[]) => {
    if (id) {
      removeFilesFromPlaylist(id, indexArray)
    }
  }

  // 删除播放列表
  const deletePlaylist = () => {
    if (id && playlists) {
      removePlaylist(id)
      setDeleteDiaLogOpen(false)
      setNewName('')
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

              {/* 背景 */}
              <Box sx={{ position: 'absolute', height: '100%', width: '100%' }}>
                {
                  metaDatas[0] && metaDatas[0].cover && metaDatas[0].cover.length > 0 && 'data' in metaDatas[0].cover[0] &&
                  <img
                    src={URL.createObjectURL(new Blob([new Uint8Array(metaDatas[0].cover[0].data as unknown as ArrayBuffer)], { type: metaDatas[0].cover[0].format }))}
                    alt='Cover'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                }
              </Box>

              <Grid size={12} container
                sx={{
                  padding: '3rem 1rem 1rem 1rem',
                  background: `linear-gradient(0deg, ${theme.palette.background.default}ff, ${theme.palette.background.default}99,${theme.palette.background.default}00)`,
                  gap: '0.25rem',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Grid size={12}>
                  <Typography variant='h4' noWrap>
                    {playlist.name}
                  </Typography>
                </Grid>
                <Grid size='auto'>
                  <Button
                    variant='contained'
                    size='small'
                    // startIcon={<MoreVertOutlined />}
                    onClick={handleClickMenu}
                  >
                    {t`More`}
                  </Button>
                </Grid>
              </Grid>

            </Grid>

            <Grid sx={{ flexGrow: 1 }}>
              <CommonList
                listData={playlist.files}
                listType='playlist'
                func={{ open, remove }}
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
          <ListItemText primary={t`Rename`} />
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteDiaLogOpen(true)
          handleCloseMenu()
        }}>
          <ListItemText primary={t`Delete`} />
        </MenuItem>
      </Menu>

      {/* 重命名播放列表 */}
      <Dialog
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        fullWidth
        disableRestoreFocus
        maxWidth='xs'
      >
        <DialogTitle>{t`Rename`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            autoComplete='off'
            margin="dense"
            fullWidth
            variant="standard"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder={t`Enter new title`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameDialog}>{t`Cancel`}</Button>
          <Button onClick={() => {
            if (id && newName) {
              renamePlaylist(id, newName)
              setRenameDialogOpen(false)
            }
          }} >
            {t`OK`}
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
          {t`The playlist will be deleted`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDiaLogOpen(false)}>{t`Cancel`}</Button>
          <Button onClick={deletePlaylist} >{t`OK`}</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default Playlist