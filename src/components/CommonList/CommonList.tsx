import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import shortUUID from 'short-uuid'
import { Button, Dialog, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined'
import { shallow } from 'zustand/shallow'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { File } from '../../type'
import { checkFileType, fileSizeConvert, shufflePlayQueue } from '../../util'

const CommonList = (
  { listData, handleClickRemove }
    : { listData: File[], handleClickRemove?: (filePathArray: string[][]) => void }) => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [folderTree, updateFolderTree] = useUiStore((state) => [state.folderTree, state.updateFolderTree], shallow)
  const [type, playQueue, updateType, updatePlayQueue, updateCurrentIndex] = usePlayQueueStore(
    (state) => [state.type, state.playQueue, state.updateType, state.updatePlayQueue, state.updateCurrentIndex],
    shallow
  )
  const [playlists, insertPlaylist, insertFilesToPlaylist] = usePlaylistsStore(
    (state) => [state.playlists, state.insertPlaylist, state.insertFilesToPlaylist],
    shallow
  )
  const [shuffle, updateShuffle] = usePlayerStore(state => [state.shuffle, state.updateShuffle], shallow)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, current: number) => {
    setMenuOpen(true)
    setCurrent(current)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  const handleClickListItem = (filePath: string[]) => {
    if (listData) {
      const currentFile = listData.find(item => item.filePath === filePath)
      if (currentFile && currentFile.fileType === 'folder') {
        updateFolderTree([...folderTree, currentFile.fileName])
      }
      if (currentFile && (currentFile.fileType === 'audio' || currentFile.fileType === 'video')) {
        let currentIndex = 0
        const list = listData
          .filter((item) => checkFileType(item.fileName) === currentFile.fileType)
          .map((item, index) => {
            if (currentFile?.filePath === item.filePath)
              currentIndex = index
            return {
              index: index,
              title: item.fileName,
              size: item.fileSize,
              path: item.filePath,
            }
          })
        if (shuffle)
          updateShuffle(false)
        updateType(currentFile.fileType)
        updatePlayQueue(list)
        updateCurrentIndex(currentIndex)
      }
    }
  }

  // 点击随机播放全部
  const handleClickShuffleAll = () => {
    if (listData) {
      const list = listData
        .filter((item) => checkFileType(item.fileName) === 'audio')
        .map((item, index) => {
          return {
            index: index,
            title: item.fileName,
            size: item.fileSize,
            path: item.filePath,
          }
        })
      if (!shuffle)
        updateShuffle(true)
      updateType('audio')
      const shuffleList = shufflePlayQueue(list)
      updatePlayQueue(shuffleList)
      updateCurrentIndex(shuffleList[0].index)
    }
  }

  // 新建播放列表
  const addNewPlaylist = () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, title: t('playlist.newPlaylist'), fileList: [] })
  }

  // 添加到播放列表
  const addToPlaylist = (id: string) => {
    insertFilesToPlaylist(id, [listData[current]])
    setDialogOpen(false)
  }

  // 添加到播放队列
  const handleClickAddToPlayQueue = () => {
    setMenuOpen(false)
    if (type === listData[current].fileType) {
      playQueue
        ? updatePlayQueue([...playQueue, { index: playQueue.length, title: listData[current].fileName, size: listData[current].fileSize, path: listData[current].filePath }])
        : updatePlayQueue([{ index: 0, title: listData[current].fileName, size: listData[current].fileSize, path: listData[current].filePath }])
    }

  }

  // 在文件夹中打开
  const handleClickOpenInFolder = () => {
    setMenuOpen(false)
    if (listData[current]) {
      updateFolderTree(listData[current].filePath.slice(0, -1))
      navigate('/')
    }
  }

  return (
    <div>
      {/* 更多菜单 */}
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
        <MenuItem onClick={handleClickAddToPlayQueue}>
          <ListItemText primary={t('playlist.addToPlayQueue')} />
        </MenuItem>
        <MenuItem onClick={handleClickOpenInFolder}>
          <ListItemText primary={t('playlist.openInFolder')} />
        </MenuItem>
        {
          handleClickRemove &&
          <MenuItem onClick={() => {
            handleClickRemove([listData[current].filePath],)
            handleCloseMenu()
          }}>
            <ListItemText primary={t('common.remove')} />
          </MenuItem>
        }
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>{t('playlist.addToPlaylist')}</DialogTitle>
        <List>
          {
            playlists?.map((item, index) =>
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
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          }
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

      {/* 文件列表 */}
      <Grid container>
        {
          (listData.length !== 0 && listData.filter(item => item.fileType === 'audio').length !== 0) &&
          <Grid xs={12}>
            <ListItem disablePadding>
              <ListItemButton onClick={handleClickShuffleAll}>
                <ListItemIcon>
                  <ShuffleOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={t('playlist.shuffleAll')} />
              </ListItemButton>
            </ListItem>
          </Grid>
        }
        {
          listData.map((item, index) =>
            <Grid key={index} lg={4} md={6} sm={12} xs={12} p={0} >
              <ListItem
                disablePadding
                secondaryAction={
                  (item.fileType === 'audio' || item.fileType === 'video') &&
                  <div>
                    <IconButton
                      aria-label={t('common.more')}
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

export default CommonList