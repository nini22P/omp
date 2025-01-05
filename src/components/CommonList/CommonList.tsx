import { useState, useEffect, Key, CSSProperties, useRef } from 'react'
import Grid from '@mui/material/Grid2'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { shufflePlayQueue } from '../../utils'
import CommonMenu from './CommonMenu'
import { FileItem } from '../../types/file'
import CommonListItem from './CommonListItem'
import { Box, Fab, List, useMediaQuery, useTheme } from '@mui/material'
import { AutoSizer, List as VirtualList } from 'react-virtualized'
import CommonListItemCard from './CommonListItemCard'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { t } from '@lingui/macro'
import { useShallow } from 'zustand/shallow'

const CommonList = (
  {
    listData,
    listType,
    display = 'list',
    scrollIndex,
    activeIndex,
    disableFAB,
    func,
  }: {
    listData: FileItem[],
    listType: 'files' | 'playlist' | 'playQueue',
    display?: 'list' | 'multicolumnList' | 'grid',
    scrollIndex?: number,
    activeIndex?: number,
    disableFAB?: boolean,
    func?: {
      open?: (index: number) => void,
      remove?: (indexArray: number[]) => void,
    },
  }) => {

  const [shuffle, updateShuffle] = useUiStore(useShallow((state) => [state.shuffle, state.updateShuffle]))

  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const updateAutoPlay = usePlayerStore((state) => state.updateAutoPlay)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectIndex, setSelectIndex] = useState<number | null>(null)
  const [selectIndexArray, setSelectIndexArray] = useState<number[]>([])

  const isSelectMode = selectIndexArray.length > 0
  const shuffleDisplay = listData.filter(item => item.fileType === 'audio' || item.fileType === 'video').length > 0
  const playAllDisplay = shuffleDisplay || listData.filter(item => item.fileType === 'folder' && /^(disc|disk)\s*\d+$/.test(item.fileName.toLocaleLowerCase())).length > 0

  const addSelectIndex = (index: number) => { setSelectIndexArray([...selectIndexArray, index].sort()) }

  const removeSelectIndex = (index: number) => setSelectIndexArray(selectIndexArray.filter((_index) => index !== _index).sort())

  const isSelected = (index: number) => selectIndexArray.includes(index)

  useEffect(() => setSelectIndexArray([]), [listData]) //列表数据变化时退出选择模式

  const switchSelect = (index: number) => isSelected(index) ? removeSelectIndex(index) : addSelectIndex(index)

  const handleClickItem = (index: number) => {
    if (func?.open)
      func.open(index)
  }

  const handleClickPlayAll = () => {
    handleClickItem(listData.findIndex(item => item.fileType === 'audio' || item.fileType === 'video'))
  }

  // 点击随机播放全部
  const handleClickShuffleAll = () => {
    if (listData) {
      const list = listData
        .filter((item) => item.fileType === 'audio' || item.fileType === 'video')
        .map((item, index) => { return { index, ...item } })
      if (!shuffle)
        updateShuffle(true)
      const shuffleList = shufflePlayQueue(list) || []
      updatePlayQueue(shuffleList)
      updateCurrentIndex(shuffleList[0].index)
      updateAutoPlay(true)
    }
  }

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen(true)
    setAnchorEl(event.currentTarget)
  }

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, selectIndex: number) => {
    setSelectIndex(selectIndex)
    openMenu(event)
  }

  const handleClickFABMenu = (event: React.MouseEvent<HTMLElement>) => {
    openMenu(event)
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
            const itemIndex = index * gridCols + i
            const item = listData[itemIndex]
            return (
              item
              &&
              <Grid
                key={item.fileName}
                size={{ xs: 12 / gridCols }}
                sx={{ aspectRatio: '4/5', overflow: 'hidden' }}
              >
                <CommonListItemCard
                  active={typeof activeIndex === 'number' ? activeIndex === itemIndex : false}
                  item={item}
                  index={itemIndex}
                  selected={isSelected(itemIndex)}
                  isSelectMode={isSelectMode}
                  handleClickItem={isSelectMode ? () => switchSelect(itemIndex) : handleClickItem}
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
            const itemIndex = index * listCols + i
            const item = listData[itemIndex]
            return (
              item
              &&
              <Grid key={item.fileName} size={{ xs: 12 / listCols }}>
                <CommonListItem
                  active={typeof activeIndex === 'number' ? activeIndex === itemIndex : false}
                  item={item}
                  index={itemIndex}
                  selected={isSelected(itemIndex)}
                  isSelectMode={isSelectMode}
                  handleClickItem={isSelectMode ? () => switchSelect(itemIndex) : handleClickItem}
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
      if (listType === 'playQueue' && listRef.current && typeof scrollIndex === 'number') {
        setTimeout(() => listRef.current?.scrollToRow(scrollIndex), 100)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // 滚动到之前点击过的文件夹
  useEffect(
    () => {
      if (listType === 'files' && listRef.current && typeof scrollIndex === 'number') {
        let index = scrollIndex

        if (display === 'grid')
          index = Math.ceil(scrollIndex / gridCols) - 1
        if ((display === 'list' || display === 'multicolumnList'))
          index = Math.ceil(scrollIndex / listCols) - 1

        if (index && index >= 0) {
          listRef.current?.scrollToRow(index)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollIndex, gridCols, listCols]
  )

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const fabRef = useRef<HTMLDivElement | null>(null)
  const touchStartYRef = useRef(0)
  useEffect(() => {
    const scroll = scrollRef.current
    const fab = fabRef.current
    if (fab && isSelectMode) {
      fab.style.transform = 'translateY(0)'
    } else if (scroll && fab && !isSelectMode) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY > 0)
          fab.style.transform = 'translateY(200%)'
        else
          fab.style.transform = 'translateY(0)'
      }
      const onTouchStart = (e: TouchEvent) => {
        touchStartYRef.current = (e.touches[0].clientY)
      }
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches[0].clientY > touchStartYRef.current) {
          fab.style.transform = 'translateY(0)'
          touchStartYRef.current = (e.touches[0].clientY)
        }
        else {
          fab.style.transform = 'translateY(200%)'
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
  }, [isSelectMode])

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }} >

      {/* 文件列表 */}
      <Grid container sx={{ flexDirection: 'column', flexWrap: 'nowrap', height: '100%' }}>
        <Grid
          size={12}
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
                      style={{ paddingBottom: isSelectMode ? '6rem' : '0rem' }}
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
                      style={{ paddingBottom: isSelectMode ? '6rem' : '0rem' }}
                    />
                  </List>
              }
            </AutoSizer>
          }
        </Grid>
      </Grid>

      {/* 菜单 */}
      <CommonMenu
        listData={listData}
        listType={listType}
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        dialogOpen={dialogOpen}
        selectIndex={selectIndex}
        selectIndexArray={selectIndexArray}
        setAnchorEl={setAnchorEl}
        setMenuOpen={setMenuOpen}
        setDialogOpen={setDialogOpen}
        setSelectIndex={setSelectIndex}
        setSelectIndexArray={setSelectIndexArray}
        handleClickRemove={func?.remove}
      />

      {/* FAB */}
      <Box
        ref={fabRef}
        sx={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          zIndex: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease-out',
        }}
      >
        {
          isSelectMode &&
          <Fab size='small' onClick={handleClickFABMenu}>
            <MoreVertRoundedIcon />
          </Fab>
        }
        {
          (listType !== 'playQueue') && !isSelectMode && !disableFAB &&
          <>
            {
              shuffleDisplay &&
              <Fab size='small' onClick={handleClickShuffleAll}>
                <ShuffleRoundedIcon />
              </Fab>
            }
            {
              playAllDisplay &&
              <Fab variant='extended' color='primary' onClick={handleClickPlayAll}>
                <PlayArrowRoundedIcon />
                <span style={{ marginLeft: '0.5rem' }}>{t`Play all`}</span>
              </Fab>
            }
          </>
        }

      </Box>

    </Box>
  )
}

export default CommonList