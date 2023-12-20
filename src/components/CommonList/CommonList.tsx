import { useState, useEffect, Key, CSSProperties } from 'react'
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
import { AutoSizer, List } from 'react-virtualized'

const CommonList = (
  {
    listData,
    func,
  }: {
    listData?: File[] | PlayQueueItem[],
    func?: {
      handleClickRemove?: (filePathArray: string[][]) => void,
    },
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

  const rowRenderer = ({ key, index, style }: { key: Key, index: number, style: CSSProperties }) => {
    return (
      listData
      &&
      <Grid key={key} style={style}>
        <CommonListItem
          active={((listData[index] as PlayQueueItem).index === currentIndex)}
          item={listData[index]}
          handleClickItem={handleClickItem}
          handleClickMenu={handleClickMenu}
        />
      </Grid>
    )
  }

  return (
    listData
    &&
    <Box sx={{ height: '100%', width: '100%' }}>
      {/* 菜单 */}
      <CommonMenu
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        dialogOpen={dialogOpen}
        currentFile={currentFile}
        setAnchorEl={setAnchorEl}
        setMenuOpen={setMenuOpen}
        setDialogOpen={setDialogOpen}
        handleClickRemove={func?.handleClickRemove}
        isPlayQueueView={isPlayQueueView}
      />

      {/* 文件列表 */}
      <Grid container sx={{ flexDirection: 'column', flexWrap: 'nowrap', height: '100%' }}>
        {
          (
            listData.length !== 0
            && listData.find((item) => item.fileType === 'audio')
            && !isPlayQueueView
          )
          &&
          <Grid xs={12}>
            <ShuffleAll handleClickShuffleAll={handleClickShuffleAll} />
          </Grid>
        }
        <Grid xs={12} sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <AutoSizer>
            {
              ({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  rowCount={listData.length}
                  rowHeight={72}
                  rowRenderer={rowRenderer}
                  style={{
                    paddingBottom: '1rem',
                  }}
                />
              )
            }
          </AutoSizer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CommonList