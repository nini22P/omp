import { Button, Dialog, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { checkFileType, filePathConvert, fileSizeConvert, shufflePlayQueue } from '../../util'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined'
import { useState } from 'react'
import { FileItem, PlayListsItem } from '../../type'
import usePlayListsStore from '../../store/usePlayListsStore'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import shortUUID from 'short-uuid'
import useUiStore from '../../store/useUiStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CommonList = (
  { fileList, handleClickRemove }
    : { fileList: FileItem[], handleClickRemove?: (filePathArray: string[][], id?: string) => void }) => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [folderTree, updateFolderTree] = useUiStore((state) => [state.folderTree, state.updateFolderTree], shallow)
  const [type, playQueue, updateType, updatePlayQueue, updateCurrent] = usePlayQueueStore((state) => [state.type, state.playQueue, state.updateType, state.updatePlayQueue, state.updateCurrent], shallow)
  const [playLists, insertPlayListsItem, updatePlayListsItem] = usePlayListsStore((state) => [state.playLists, state.insertPlayListsItem, state.updatePlayListsItem], shallow)
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
    if (fileList) {
      const currentFile = fileList.find(item => item.filePath === filePath)
      if (currentFile && currentFile.fileType === 'folder') {
        updateFolderTree([...folderTree, currentFile.fileName])
      }
      if (currentFile && (currentFile.fileType === 'audio' || currentFile.fileType === 'video')) {
        let currentIndex = 0
        const list = fileList
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
        updateCurrent(currentIndex)
      }
    }
  }

  // 点击随机播放全部
  const handleClickShuffleAll = () => {
    if (fileList) {
      const list = fileList
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
      updateCurrent(shuffleList[0].index)
    }
  }

  // 新建播放列表
  const addNewPlayList = () => {
    const id = shortUUID().generate()
    insertPlayListsItem({ id, title: t('playlist.newPlaylist'), playList: [] })
  }

  // 添加到播放列表
  const addToPlayList = (playListsItem: PlayListsItem) => {
    updatePlayListsItem(
      {
        ...playListsItem,
        playList: [fileList[current], ...playListsItem.playList.filter((item) => filePathConvert(item.filePath) !== filePathConvert(fileList[current].filePath))]
      })
    setDialogOpen(false)
  }

  // 添加到播放队列
  const handleClickAddToPlayQueue = () => {
    setMenuOpen(false)
    if (type === fileList[current].fileType) {
      playQueue
        ? updatePlayQueue([...playQueue, { index: playQueue.length, title: fileList[current].fileName, size: fileList[current].fileSize, path: fileList[current].filePath }])
        : updatePlayQueue([{ index: 0, title: fileList[current].fileName, size: fileList[current].fileSize, path: fileList[current].filePath }])
    }

  }

  // 在文件夹中打开
  const handleClickOpenInFolder = () => {
    setMenuOpen(false)
    if (fileList[current]) {
      updateFolderTree(fileList[current].filePath.slice(0, -1))
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
            handleClickRemove([fileList[current].filePath],)
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
            playLists?.map((item, index) =>
              <ListItem
                disablePadding
                key={index}
              >
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => addToPlayList(item)}
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
              onClick={addNewPlayList}
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
          (fileList.length !== 0 && fileList.filter(item => item.fileType === 'audio').length !== 0) &&
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
          fileList.map((item, index) =>
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