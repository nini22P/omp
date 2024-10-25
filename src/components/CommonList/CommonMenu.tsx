import { t } from '@lingui/macro'
import { useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { Menu, MenuItem, ListItemText, Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import useUiStore from '../../store/useUiStore'
import { FileItem } from '../../types/file'
import { useShallow } from 'zustand/shallow'

const CommonMenu = (
  {
    listData,
    listType,
    anchorEl,
    menuOpen,
    dialogOpen,
    selectIndex,
    selectIndexArray,
    setAnchorEl,
    setMenuOpen,
    setDialogOpen,
    setSelectIndex,
    setSelectIndexArray,
    handleClickRemove,
  }
    :
    {
      listData: FileItem[],
      listType: 'files' | 'playlist' | 'playQueue',
      anchorEl: null | HTMLElement,
      menuOpen: boolean,
      dialogOpen: boolean,
      selectIndex: number | null,
      selectIndexArray: number[],
      setAnchorEl: (anchorEl: null | HTMLElement) => void,
      setMenuOpen: (menuOpen: boolean) => void,
      setDialogOpen: (dialogOpen: boolean) => void,
      setSelectIndex: (index: number | null) => void
      setSelectIndexArray: (setSelectIndexArray: number[]) => void,
      handleClickRemove?: (indexArray: number[]) => void,
    }
) => {

  const navigate = useNavigate()

  const [updateFolderTree] = useUiStore(
    useShallow((state) => [state.updateFolderTree])
  )
  const [playQueue, updatePlayQueue] = usePlayQueueStore(
    useShallow((state) => [state.playQueue, state.updatePlayQueue])
  )
  const [playlists, insertPlaylist, insertFilesToPlaylist] = usePlaylistsStore(
    useShallow((state) => [state.playlists, state.insertPlaylist, state.insertFilesToPlaylist])
  )
  const [updateAudioViewIsShow, updateVideoViewIsShow, updatePlayQueueIsShow] = useUiStore(
    useShallow((state) => [state.updateAudioViewIsShow, state.updateVideoViewIsShow, state.updatePlayQueueIsShow])
  )

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  // 新建播放列表
  const addNewPlaylist = () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, title: t`New playlist`, fileList: [] })
  }

  // 添加到播放列表
  const addToPlaylist = (id: string) => {
    if (typeof selectIndex === 'number') {
      insertFilesToPlaylist(id, [
        {
          fileName: listData[selectIndex].fileName,
          filePath: listData[selectIndex].filePath,
          fileSize: listData[selectIndex].fileSize,
          fileType: listData[selectIndex].fileType,
        }
      ])
      setSelectIndex(null)
    } else if (selectIndexArray.length > 0) {
      insertFilesToPlaylist(id,
        selectIndexArray
          .filter(index => listData[index].fileType === 'audio' || listData[index].fileType === 'video')
          .map(index => (
            {
              fileName: listData[index].fileName,
              filePath: listData[index].filePath,
              fileSize: listData[index].fileSize,
              fileType: listData[index].fileType,
            }
          )))
      setSelectIndexArray([])
    }
    setDialogOpen(false)
  }

  // 添加到播放队列
  const handleClickAddToPlayQueue = () => {
    if (typeof selectIndex === 'number') {
      if (playQueue) {
        updatePlayQueue([...playQueue, { ...listData[selectIndex], index: Math.max(...playQueue.map(item => item.index)) + 1 }])
      } else {
        updatePlayQueue([{ ...listData[selectIndex], index: 0 }])
      }
    } else if (selectIndexArray && selectIndexArray.length > 0) {
      if (playQueue) {
        updatePlayQueue([
          ...playQueue,
          ...selectIndexArray
            .filter(index => listData[index].fileType === 'audio' || listData[index].fileType === 'video')
            .map((index, _index) => ({ ...listData[index], index: Math.max(...playQueue.map(item => item.index)) + _index + 1 }))
        ])
      } else {
        updatePlayQueue(
          selectIndexArray
            .filter(index => listData[index].fileType === 'audio' || listData[index].fileType === 'video')
            .map((index, _index) => ({ ...listData[index], index: _index }))
        )
      }
    }
    setMenuOpen(false)
    setSelectIndex(null)
    setSelectIndexArray([])
  }

  // 打开所在文件夹
  const handleClickOpenInFolder = () => {
    if (typeof selectIndex === 'number') {
      updateFolderTree(listData[selectIndex].filePath.slice(0, -1))
      navigate('/')
      setMenuOpen(false)
      setSelectIndex(null)
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
          <ListItemText primary={t`Add to playlist`} />
        </MenuItem>
        {
          (listType !== 'playQueue') &&
          <MenuItem onClick={handleClickAddToPlayQueue}>
            <ListItemText primary={t`Add to play queue`} />
          </MenuItem>
        }

        {  // 在 Files 组件中隐藏
          handleClickRemove && typeof selectIndex === 'number' &&
          <MenuItem onClick={handleClickOpenInFolder}>
            <ListItemText primary={t`Open in folder`} />
          </MenuItem>
        }

        {
          handleClickRemove &&
          <MenuItem
            onClick={() => {
              if (typeof selectIndex === 'number') {
                handleClickRemove([selectIndex])
              } else if (selectIndexArray.length > 0) {
                handleClickRemove(selectIndexArray)
              }
              setSelectIndex(null)
              setSelectIndexArray([])
              handleCloseMenu()
            }}
          >
            <ListItemText primary={t`Remove`} />
          </MenuItem>
        }

        {
          typeof selectIndex === 'number' && (selectIndexArray.length === 0) &&
          <MenuItem onClick={() => {
            if (typeof selectIndex === 'number') {
              setSelectIndexArray([...selectIndexArray, selectIndex])
            }
            handleCloseMenu()
            setSelectIndex(null)
          }}>
            <ListItemText primary={t`Select`} />
          </MenuItem>
        }

        {
          <MenuItem onClick={() => {
            setSelectIndex(null)
            setSelectIndexArray(Array.from({ length: listData.length }, (v, i) => i))
            handleCloseMenu()
          }}>
            <ListItemText primary={t`Select all`} />
          </MenuItem>
        }

        {
          (selectIndexArray.length > 0) &&
          <MenuItem onClick={() => {
            setSelectIndex(null)
            setSelectIndexArray([])
            handleCloseMenu()
          }}>
            <ListItemText primary={t`Cancel select`} />
          </MenuItem>
        }
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>{t`Add to playlist`}</DialogTitle>
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
                  <ListRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              onClick={addNewPlaylist}
            >
              <ListItemIcon>
                <PlaylistAddRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={t`Add playlist`} />
            </ListItemButton>
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t`Cancel`}</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default CommonMenu