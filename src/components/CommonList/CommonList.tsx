import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined'
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { checkFileType, fileSizeConvert, shufflePlayQueue } from '../../utils'
import CommonMenu from './CommonMenu'
import useTheme from '../../hooks/useTheme'
import { PlayQueueItem } from '../../types/playQueue'
import { File } from '../../types/file'

const CommonList = (
  { listData, multiColumn, handleClickRemove }
    : { listData?: File[] | PlayQueueItem[], multiColumn?: boolean, handleClickRemove?: (filePathArray: string[][]) => void }) => {

  const { t } = useTranslation()
  const { styles } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<null | File>(null)

  const [folderTree, updateFolderTree] = useUiStore((state) => [state.folderTree, state.updateFolderTree])
  const [currentIndex, updateType, updatePlayQueue, updateCurrentIndex] = usePlayQueueStore(
    (state) => [state.currentIndex, state.updateType, state.updatePlayQueue, state.updateCurrentIndex],
    shallow
  )
  const [shuffle, updateShuffle] = usePlayerStore(state => [state.shuffle, state.updateShuffle])

  const isPlayQueueView = listData?.some((item) => typeof (item as PlayQueueItem).index === 'number')

  // 打开播放队列时滚动到当前播放文件
  useEffect(() => {
    isPlayQueueView && document.getElementById('playing-item')?.scrollIntoView({ behavior: 'auto', block: 'center' })
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, currentFile: File) => {
    setMenuOpen(true)
    setCurrentFile(currentFile)
    setAnchorEl(event.currentTarget)
  }

  // 点击列表项
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
            return { index, ...item }
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
        .map((item, index) => { return { index, ...item } })
      if (!shuffle)
        updateShuffle(true)
      updateType('audio')
      const shuffleList = shufflePlayQueue(list)
      updatePlayQueue(shuffleList)
      updateCurrentIndex(shuffleList[0].index)
    }
  }

  return (
    <div>
      {/* 菜单 */}
      <CommonMenu
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        dialogOpen={dialogOpen}
        currentFile={currentFile}
        setAnchorEl={setAnchorEl}
        setMenuOpen={setMenuOpen}
        setDialogOpen={setDialogOpen}
        handleClickRemove={handleClickRemove}
        isPlayQueueView={isPlayQueueView}
      />

      {/* 文件列表 */}
      <Grid container>
        {
          (
            listData &&
            listData.length !== 0 &&
            listData.find((item) => item.fileType === 'audio') &&
            !isPlayQueueView
          ) &&
          <Grid xs={12}>
            <ListItem
              disablePadding
              sx={{
                '& .MuiListItemButton-root': {
                  paddingLeft: 3,
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 0,
                  marginRight: 3,
                },
              }}
            >
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
          listData?.map((item, index) =>
            <Grid key={index} lg={multiColumn ? 4 : 12} md={multiColumn ? 6 : 12} sm={12} xs={12} p={0} >
              <ListItem
                disablePadding
                id={(item as PlayQueueItem).index === currentIndex ? 'playing-item' : ''}
                sx={{
                  '& .MuiListItemButton-root': {
                    paddingLeft: 3,
                    // paddingRight: 9,
                  },
                  '& .MuiListItemSecondaryAction-root': {
                    right: '4px',
                  }
                }}
                secondaryAction={
                  (item.fileType === 'audio' || item.fileType === 'video') &&
                  <div>
                    <IconButton
                      aria-label={t('common.more')}
                      onClick={(event) =>
                        handleClickMenu(event,
                          {
                            fileName: item.fileName,
                            filePath: item.filePath,
                            fileSize: item.fileSize,
                            fileType: item.fileType,
                          }
                        )}
                    >
                      <MoreVertOutlined />
                    </IconButton>
                  </div>
                }
              >
                <ListItemButton
                  onClick={() => ((item as PlayQueueItem).index) ? updateCurrentIndex(index) : handleClickListItem(item.filePath)}
                  sx={{
                    '& .MuiListItemIcon-root': {
                      minWidth: 0,
                      marginRight: 3,
                    },
                    '.MuiListItemText-root': {
                      color: ((item as PlayQueueItem).index === currentIndex)
                        ? styles.color.primary
                        : ''
                    },
                    '.MuiListItemText-secondary': {
                      color: ((item as PlayQueueItem).index === currentIndex)
                        ? styles.color.primary
                        : ''
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.fileType === 'folder' && <FolderOutlinedIcon />}
                    {item.fileType === 'audio' && <MusicNoteIcon />}
                    {item.fileType === 'video' && <MovieIcon />}
                    {item.fileType === 'picture' && <InsertPhotoOutlinedIcon />}
                    {item.fileType === 'other' && <InsertDriveFileOutlinedIcon />}
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