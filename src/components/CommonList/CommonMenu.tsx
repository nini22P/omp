import { useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { Menu, MenuItem, ListItemText, Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlaylistsStore from '@/store/usePlaylistsStore'
import useUiStore from '@/store/useUiStore'
import { FileNode, Track } from '@/types/file'
import { useShallow } from 'zustand/shallow'
import { useLingui } from '@lingui/react/macro'
import { fileNodeToTrack, isAudio, isVideo } from '@/utils'

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
      listData: FileNode[] | Track[],
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
  const { t } = useLingui()

  const navigate = useNavigate()

  const playQueue = usePlayQueueStore.use.playQueue()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()

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
    insertPlaylist({ id, name: t`New playlist`, files: [] })
  }

  // 添加到播放列表
  const addToPlaylist = (id: string) => {
    if (typeof selectIndex === 'number') {
      insertFilesToPlaylist(id, [
        {
          id: listData[selectIndex].id,
          name: listData[selectIndex].name,
          path: listData[selectIndex].path,
          size: listData[selectIndex].size,
        }
      ])
      setSelectIndex(null)
    } else if (selectIndexArray.length > 0) {
      insertFilesToPlaylist(id,
        selectIndexArray
          .filter(index => isAudio(listData[index].name) || isVideo(listData[index].name))
          .map(index => (
            {
              id: listData[index].id,
              name: listData[index].name,
              path: listData[index].path,
              size: listData[index].size,
            }
          )))
      setSelectIndexArray([])
    }
    setDialogOpen(false)
  }

  // 添加到播放队列
  const handleClickAddToPlayQueue = () => {
    if (typeof selectIndex === 'number') {
      if (playQueue.length > 0) {
        updatePlayQueue([
          ...playQueue,
          {
            track: fileNodeToTrack(listData[selectIndex]),
            index: Math.max(...playQueue.map(item => item.index)) + 1
          }
        ])
      } else {
        updatePlayQueue([{ track: fileNodeToTrack(listData[selectIndex]), index: 0 }])
      }
    } else if (selectIndexArray && selectIndexArray.length > 0) {
      if (playQueue) {
        updatePlayQueue([
          ...playQueue,
          ...selectIndexArray
            .filter(index => isAudio(listData[index].name) || isVideo(listData[index].name))
            .map((index, _index) => ({ track: fileNodeToTrack(listData[index]), index: Math.max(...playQueue.map(item => item.index)) + _index + 1 }))
        ])
      } else {
        updatePlayQueue(
          selectIndexArray
            .filter(index => isAudio(listData[index].name) || isVideo(listData[index].name))
            .map((index, _index) => ({ track: fileNodeToTrack(listData[index]), index: _index }))
        )
      }
    }
    setMenuOpen(false)
    setSelectIndex(null)
    setSelectIndexArray([])
  }

  // 打开所在文件夹
  const handleClickOpenInFolder = async () => {
    if (typeof selectIndex === 'number' && listData[selectIndex].path) {
      navigate(`/files/${listData[selectIndex].path.join('/')}`)
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
                <ListItemText primary={item.name} />
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