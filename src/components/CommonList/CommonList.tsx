import { useState, useEffect, Key, CSSProperties, useRef } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import usePictureStore from '@/store/usePictureStore'
import { checkFileType, pathConvert, shufflePlayQueue } from '../../utils'
import CommonMenu from './CommonMenu'
import { PlayQueueItem } from '../../types/playQueue'
import { File } from '../../types/file'
import CommonListItem from './CommonListItem'
import { Box, Fab, List, useMediaQuery, useTheme } from '@mui/material'
import { AutoSizer, List as VirtualList } from 'react-virtualized'
import CommonListItemCard from './CommonListItemCard'
import { useTranslation } from 'react-i18next'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { useNavigate } from 'react-router-dom'

const CommonList = (
  {
    listData,
    listType,
    display = 'list',
    scrollFilePath,
    activeFilePath,
    func,
  }: {
    listData?: File[] | PlayQueueItem[],
    listType: 'files' | 'playlist' | 'playQueue',
    display?: 'list' | 'multicolumnList' | 'grid',
    scrollFilePath?: File['filePath'],
    activeFilePath?: File['filePath'],
    func?: {
      handleClickRemove?: (filePathArray: string[][]) => void,
    },
  }) => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<null | File>(null)

  const [
    shuffle,
    updateVideoViewIsShow,
    updateFolderTree,
    updateShuffle
  ] = useUiStore(
    (state) => [
      state.shuffle,
      state.updateVideoViewIsShow,
      state.updateFolderTree,
      state.updateShuffle,
    ])

  const [updateType, updatePlayQueue, updateCurrentIndex] = usePlayQueueStore(
    (state) => [state.updateType, state.updatePlayQueue, state.updateCurrentIndex])

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
        updateFolderTree(currentFile.filePath)
        if (listType === 'playlist')
          navigate('/')
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

  const handleClickPlayAll = () => {
    if (listData) {
      const list = listData.filter((item) => checkFileType(item.fileName) === 'audio')
      handleClickItem(list[0])
    }
  }

  // 点击随机播放全部
  const handleClickShuffleAll = () => {
    if (listData) {
      const list = listData
        .filter((item) => item.fileType === 'audio')
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

  const handleClickItem = (item: PlayQueueItem | File) => {
    if (listType === 'playQueue')
      handleClickPlayQueueItem((item as PlayQueueItem).index)
    else {
      handleClickListItem(item.filePath)
    }
  }

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('xs'))
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))

  const getGridCols = (): number => {
    if (xl) return 6
    if (lg) return 5
    if (md) return 4
    if (sm) return 3
    if (xs) return 2
    return 2
  }

  const getListCols = (): number => {
    if (xl) return 3
    if (lg) return 3
    if (md) return 2
    if (sm) return 1
    if (xs) return 1
    return 1
  }

  const gridCols = getGridCols()
  const listCols = (display === 'multicolumnList') ? getListCols() : 1

  const gridRenderer = ({ key, index, style }: { key: Key, index: number, style: CSSProperties }) => {
    return (
      listData
      &&
      <Grid container key={key} style={style}>
        {
          [...Array(gridCols)].map((_, i) => {
            const item = listData[index * gridCols + i]
            return (
              item
              &&
              <Grid key={item.fileName} xs={12 / gridCols} sx={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                <CommonListItemCard
                  active={activeFilePath ? pathConvert(activeFilePath) === pathConvert(item.filePath) : false}
                  item={item}
                  handleClickItem={handleClickItem}
                  handleClickMenu={handleClickMenu}
                />
              </Grid>
            )
          })
        }
      </Grid>
    )
  }

  const rowRenderer = ({ key, index, style }: { key: Key, index: number, style: CSSProperties }) => {
    return (
      listData
      &&
      <Grid container key={key} style={style}>
        {
          [...Array(listCols)].map((_, i) => {
            const item = listData[index * listCols + i]
            return (
              item
              &&
              <Grid key={item.fileName} xs={12 / listCols}>
                <CommonListItem
                  active={activeFilePath ? pathConvert(activeFilePath) === pathConvert(item.filePath) : false}
                  item={item}
                  handleClickItem={handleClickItem}
                  handleClickMenu={handleClickMenu}
                />
              </Grid>
            )
          })
        }
      </Grid>
    )
  }

  const listRef = useRef<VirtualList | null>(null)
  const updateListRowHeight = () => listRef.current && listRef.current.recomputeRowHeights()

  // 打开播放队列时滚动到当前播放文件
  useEffect(
    () => {
      if (listType === 'playQueue' && listRef.current && scrollFilePath) {
        const index = listData?.findIndex((item) => pathConvert(scrollFilePath) === pathConvert(item.filePath))
        setTimeout(() => listRef.current?.scrollToRow(index), 100)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // 滚动到之前点击过的文件夹
  useEffect(
    () => {
      if (listType === 'files' && listRef.current && scrollFilePath) {
        let index = listData?.findIndex((item) => pathConvert(scrollFilePath) === pathConvert(item.filePath))
        if (index && display === 'grid')
          index = Math.ceil(index / gridCols) - 1
        if (index && (display === 'list' || display === 'multicolumnList'))
          index = Math.ceil(index / listCols) - 1
        listRef.current?.scrollToRow(index)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollFilePath, gridCols, listCols]
  )

  const fabDisplay = listData && listData.length !== 0 && listData.find((item) => item.fileType === 'audio') && listType !== 'playQueue'

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const fabRef = useRef<HTMLDivElement | null>(null)
  const touchStartYRef = useRef(0)
  useEffect(() => {
    const scroll = scrollRef.current
    const fab = fabRef.current
    if (scroll && fab) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY > 0)
          fab.style.visibility = 'hidden'
        else
          fab.style.visibility = 'visible'
      }
      const onTouchStart = (e: TouchEvent) => {
        touchStartYRef.current = (e.touches[0].clientY)
      }
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches[0].clientY > touchStartYRef.current) {
          fab.style.visibility = 'visible'
          touchStartYRef.current = (e.touches[0].clientY)
        }
        else {
          fab.style.visibility = 'hidden'
          touchStartYRef.current = (e.touches[0].clientY)
        }

      }
      scroll.addEventListener('wheel', onWheel)
      scroll.addEventListener('touchstart', onTouchStart)
      scroll.addEventListener('touchmove', onTouchMove)
      return () => {
        scroll.removeEventListener('wheel', onWheel)
        scroll.removeEventListener('touchstart', onTouchStart)
        scroll.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [])

  return (
    listData
    &&
    <Box sx={{ height: '100%', width: '100%' }} >

      {/* 文件列表 */}
      <Grid container sx={{ flexDirection: 'column', flexWrap: 'nowrap', height: '100%' }}>
        <Grid
          xs={12}
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
          }}
          ref={scrollRef}
        >

          {
            display === 'grid'
            &&
            <AutoSizer onResize={() => updateListRowHeight()}>
              {
                ({ height, width }) =>
                  <List>
                    <VirtualList
                      ref={(ref => (listRef.current = ref))}
                      height={height - 8}
                      width={width - 8}
                      rowCount={Math.ceil(listData.length / gridCols)}
                      rowHeight={width / gridCols / 4 * 5}
                      rowRenderer={gridRenderer}
                      scrollToAlignment={'center'}
                    />
                  </List>
              }
            </AutoSizer>
          }
          {
            (display === 'list' || display === 'multicolumnList')
            &&
            <AutoSizer onResize={() => updateListRowHeight()}>
              {
                ({ height, width }) =>
                  <List>
                    <VirtualList
                      ref={(ref => (listRef.current = ref))}
                      height={height - 8}
                      width={width - 8}
                      rowCount={Math.ceil(listData.length / listCols)}
                      rowHeight={72}
                      rowRenderer={rowRenderer}
                      scrollToAlignment={'center'}
                    />
                  </List>
              }
            </AutoSizer>
          }
        </Grid>
      </Grid>

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
        listType={listType}
      />

      {
        fabDisplay &&
        <Box
          ref={fabRef}
          sx={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Fab size='small' onClick={() => handleClickShuffleAll()}>
            <ShuffleRoundedIcon />
          </Fab>
          <Fab variant='extended' color='primary' onClick={() => handleClickPlayAll()}>
            <PlayArrowRoundedIcon />
            {t('playlist.playAll')}
          </Fab>
        </Box>
      }

    </Box>
  )
}

export default CommonList