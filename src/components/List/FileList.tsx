import { Button, Dialog, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { checkFileType, fileSizeConvert, shufflePlayQueue } from '../../util'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined'
import { useState } from 'react'
import { FileItem } from '../../type'
import usePlayListsStore from '../../store/usePlayListsStore'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import shortUUID from 'short-uuid'

const FileList = (
  { fileList, handleClickRemove, folderTree, setFolderTree }
    : { fileList: FileItem[], handleClickRemove?: (filePathArray: string[], id?: string) => void, folderTree?: string[], setFolderTree?: (value: React.SetStateAction<string[]>) => void }) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [updateType, updatePlayQueue, updateCurrent] = usePlayQueueStore((state) => [state.updateType, state.updatePlayQueue, state.updateCurrent], shallow)
  const [playLists, insertPlayListsItem, updatePlayListsItem] = usePlayListsStore((state) => [state.playLists, state.insertPlayListsItem, state.updatePlayListsItem], shallow)
  const shuffle = usePlayerStore(state => state.shuffle)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, current: number) => {
    setMenuOpen(true)
    setCurrent(current)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  const handleClickListItem = (filePath: string) => {
    if (fileList) {
      const currentFile = fileList.find(item => item.filePath === filePath)
      if (currentFile && setFolderTree && folderTree && currentFile.fileType === 'folder') {
        setFolderTree([...folderTree, currentFile.fileName])
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
          updatePlayQueue(shufflePlayQueue(list, currentIndex))
        else
          updatePlayQueue(list)
        updateType(currentFile.fileType)
        updateCurrent(currentIndex)
      }
    }
  }

  const addPlayList = () => {
    const id = shortUUID().generate()
    insertPlayListsItem({ id, title: 'New Playlist', playList: [] })
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
          <ListItemText primary='Add to playlist' />
        </MenuItem>
        {
          handleClickRemove &&
          <MenuItem onClick={() => {
            handleClickRemove([fileList[current].filePath],)
            handleCloseMenu()
          }}>
            <ListItemText primary='Remove' />
          </MenuItem>
        }
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Add to playlist</DialogTitle>
        <List>
          {
            playLists?.map((item, index) =>
              <ListItem
                disablePadding
                key={index}
              >
                <ListItemButton
                  sx={{ pl: 3 }}
                  onClick={() => {
                    updatePlayListsItem({ ...item, playList: [fileList[current], ...item.playList] })
                    setDialogOpen(false)
                  }}
                >
                  <ListItemIcon>
                    <ListOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )
          }
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              onClick={addPlayList}
            >
              <ListItemIcon>
                <PlaylistAddOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Add new playlist' />
            </ListItemButton>
          </ListItem>
        </List>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancal</Button>
        </DialogActions>
      </Dialog>

      {/* 文件列表 */}
      <Grid container>
        {
          (fileList.length !== 0 && fileList.filter(item => item.fileType === 'audio').length !== 0) &&
          <Grid xs={12}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ShuffleOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary='Shuffle all' />
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
                      aria-label="more"
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

export default FileList