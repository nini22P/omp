import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { Menu, MenuItem, ListItemText, Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import useUiStore from '../../store/useUiStore'
import { filePathConvert } from '../../utils'
import { File } from '../../types/file'

const CommonMenu = (
  {
    anchorEl,
    menuOpen,
    dialogOpen,
    currentFile,
    setAnchorEl,
    setMenuOpen,
    setDialogOpen,
    handleClickRemove,
    isPlayQueueView,
  }
    :
    {
      anchorEl: null | HTMLElement,
      menuOpen: boolean,
      dialogOpen: boolean,
      currentFile: null | File,
      setAnchorEl: (anchorEl: null | HTMLElement) => void,
      setMenuOpen: (menuOpen: boolean) => void,
      setDialogOpen: (dialogOpen: boolean) => void,
      handleClickRemove?: (filePathArray: string[][]) => void,
      isPlayQueueView?: boolean,
    }
) => {

  const { t } = useTranslation()
  const navigate = useNavigate()

  const [updateFolderTree] = useUiStore((state) => [state.updateFolderTree])
  const [playQueue, currentIndex, updatePlayQueue] = usePlayQueueStore(
    (state) => [state.playQueue, state.currentIndex, state.updatePlayQueue],
    shallow
  )
  const [playlists, insertPlaylist, insertFilesToPlaylist] = usePlaylistsStore(
    (state) => [state.playlists, state.insertPlaylist, state.insertFilesToPlaylist],
    shallow
  )
  const [updateAudioViewIsShow, updateVideoViewIsShow, updatePlayQueueIsShow] = useUiStore(
    (state) => [state.updateAudioViewIsShow, state.updateVideoViewIsShow, state.updatePlayQueueIsShow]
  )

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  // 新建播放列表
  const addNewPlaylist = () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, title: t('playlist.newPlaylist'), fileList: [] })
  }

  // 添加到播放列表
  const addToPlaylist = (id: string) => {
    if (currentFile) {
      insertFilesToPlaylist(id, [currentFile])
      setDialogOpen(false)
    }
  }

  // 添加到播放队列
  const handleClickAddToPlayQueue = () => {
    if (currentFile) {
      playQueue
        ? updatePlayQueue([...playQueue, { index: playQueue.length, ...currentFile }])
        : updatePlayQueue([{ index: 0, ...currentFile }])
      setMenuOpen(false)
    }
  }

  // 打开所在文件夹
  const handleClickOpenInFolder = () => {
    if (currentFile) {
      updateFolderTree(currentFile.filePath.slice(0, -1))
      navigate('/')
      setMenuOpen(false)
      updateAudioViewIsShow(false)
      updateVideoViewIsShow(false)
      updatePlayQueueIsShow(false)
    }
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          setDialogOpen(true)
          handleCloseMenu()
        }}>
          <ListItemText primary={t('playlist.addToPlaylist')} />
        </MenuItem>
        {  // 当前选择文件不在播放队列中时显示
          (currentFile && !playQueue?.find((file) => {
            return filePathConvert(file.filePath) === filePathConvert(currentFile?.filePath)
          })) &&
          <MenuItem onClick={handleClickAddToPlayQueue}>
            <ListItemText primary={t('playlist.addToPlayQueue')} />
          </MenuItem>
        }

        {  // 在 Files 组件中隐藏
          handleClickRemove &&
          <MenuItem onClick={handleClickOpenInFolder}>
            <ListItemText primary={t('playlist.openInFolder')} />
          </MenuItem>
        }

        {
          (
            handleClickRemove &&
            currentFile &&
            !(isPlayQueueView && currentFile?.filePath === playQueue?.find((item) => item.index === currentIndex)?.filePath)
          ) &&
          <MenuItem
            onClick={() => {
              handleClickRemove([currentFile.filePath])
              handleCloseMenu()
            }}
          >
            <ListItemText primary={t('common.remove')} />
          </MenuItem>
        }
      </Menu><Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>{t('playlist.addToPlaylist')}</DialogTitle>
        <List>
          {playlists?.map((item, index) =>
            <ListItem
              disablePadding
              key={index}
            >
              <ListItemButton
                sx={{ pl: 3 }}
                onClick={() => addToPlaylist(item.id)}
              >
                <ListItemIcon>
                  <ListOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    style: {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }} />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              onClick={addNewPlaylist}
            >
              <ListItemIcon>
                <PlaylistAddOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={t('playlist.addPlaylist')} />
            </ListItemButton>
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default CommonMenu