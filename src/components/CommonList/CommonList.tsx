import { useState, useEffect } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import usePictureStore from '@/store/usePictureStore'
import { checkFileType, shufflePlayQueue } from '../../utils'
import CommonMenu from './CommonMenu'
import { PlayQueueItem } from '../../types/playQueue'
import { File } from '../../types/file'
import CommonListItem from './CommonListItem'
import ShuffleAll from './ShuffleAll'
import { Box } from '@mui/material'

const CommonList = (
  {
    listData,
    multiColumn,
    handleClickRemove,
  }: {
    listData?: File[] | PlayQueueItem[],
    multiColumn?: boolean,
    handleClickRemove?: (filePathArray: string[][]) => void,
  }) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<null | File>(null)

  const [folderTree, shuffle, updateVideoViewIsShow, updateFolderTree, updateShuffle] = useUiStore(
    (state) => [state.folderTree, state.shuffle, state.updateVideoViewIsShow, state.updateFolderTree, state.updateShuffle])

  const [currentIndex, updateType, updatePlayQueue, updateCurrentIndex] = usePlayQueueStore(
    (state) => [state.currentIndex, state.updateType, state.updatePlayQueue, state.updateCurrentIndex])

  const [updatePlayStatu] = usePlayerStore(state => [state.updatePlayStatu])

  const [
    updatePictureList,
    updateCurrentPicture,
  ] = usePictureStore(
    state => [
      state.updatePictureList,
      state.updateCurrentPicture,
    ]
  )

  const isPlayQueueView = listData?.some((item) => typeof (item as PlayQueueItem).index === 'number')

  // 打开播放队列时滚动到当前播放文件
  useEffect(
    () => {
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

      if (currentFile && currentFile.fileType === 'picture') {
        const list = listData.filter(item => item.fileType === 'picture')
        updatePictureList(list)
        updateCurrentPicture(currentFile)
      }

      if (currentFile && (currentFile.fileType === 'audio' || currentFile.fileType === 'video')) {
        let currentIndex = 0
        const list = listData
          .filter((item) => item.fileType === currentFile.fileType)
          .map((item, index) => {
            if (currentFile?.filePath === item.filePath)
              currentIndex = index
            return { index, ...item }
          })
        if (shuffle) {
          updateShuffle(false)
        }
        updateType(currentFile.fileType)
        updatePlayQueue(list)
        updateCurrentIndex(currentIndex)
        updatePlayStatu('playing')
        if (currentFile.fileType === 'video') {
          updateVideoViewIsShow(true)
        }
      }
    }
  }

  // 点击播放队列列表
  const handleClickPlayQueueItem = (index: number) => {
    updatePlayStatu('playing')
    updateCurrentIndex(index)
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
      updatePlayStatu('playing')
    }
  }

  const handleClickItem = (item: PlayQueueItem | File) =>
    ((item as PlayQueueItem).index)
      ? handleClickPlayQueueItem((item as PlayQueueItem).index)
      : handleClickListItem(item.filePath)

  return (
    <Box>
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
            listData
            && listData.length !== 0
            && listData.find((item) => item.fileType === 'audio')
            && !isPlayQueueView
          )
          &&
          <Grid xs={12}>
            <ShuffleAll handleClickShuffleAll={handleClickShuffleAll} />
          </Grid>
        }
        {
          listData?.map((item, index) =>
            <Grid key={index} xs={12} sm={12} md={multiColumn ? 6 : 12} lg={multiColumn ? 4 : 12} p={0} >
              <CommonListItem
                active={((item as PlayQueueItem).index === currentIndex)}
                item={item}
                handleClickItem={handleClickItem}
                handleClickMenu={handleClickMenu}
              />
            </Grid>
          )
        }
      </Grid>
    </Box>
  )
}

export default CommonList