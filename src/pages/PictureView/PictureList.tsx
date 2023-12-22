import usePictureStore from '@/store/usePictureStore'
import { Box } from '@mui/material'
import PictureListItem from './PictureListItem'
import { Grid, WindowScroller } from 'react-virtualized'
import { CSSProperties, Key, useEffect, useRef } from 'react'

const PictureList = () => {
  const [
    pictureList,
    currentPicture,
    updateCurrentPicture,
  ] = usePictureStore(
    state => [
      state.pictureList,
      state.currentPicture,
      state.updateCurrentPicture,
    ]
  )

  const currentIndex = pictureList.findIndex(picture => picture.id === currentPicture?.id)

  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const gridRef = useRef<Grid | null>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const grid = gridRef.current
    if (scrollContainer && grid) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return
        e.preventDefault()
        const gridWidth = grid.props.columnWidth as number * grid.props.columnCount
        let left: number = grid.state.scrollLeft + e.deltaY * 2
        if (left < 0) left = 0
        if (left + grid.props.width + 32 > gridWidth) left = gridWidth - grid.props.width + 32
        grid.scrollToPosition({ scrollLeft: left, scrollTop: 0 })
      }
      scrollContainer.addEventListener('wheel', onWheel)
      return () => scrollContainer.removeEventListener('wheel', onWheel)
    }
  }, [])


  const cellRenderer = ({ columnIndex, key, style }: { columnIndex: number, key: Key, style: CSSProperties }) =>
    <Box onClick={() => updateCurrentPicture(pictureList[columnIndex])} key={key} style={style} sx={{ padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PictureListItem picture={pictureList[columnIndex]} isCurrent={columnIndex === currentIndex} />
    </Box>

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      flexWrap={'nowrap'}
      width={'100%'}
      overflow={'auto'}
      height='auto'
      ref={scrollContainerRef}
    >
      <WindowScroller>
        {({ height, width }) => (
          <Grid
            cellRenderer={cellRenderer}
            ref={ref => gridRef.current = ref}
            columnCount={pictureList.length}
            columnWidth={104}
            rowCount={1}
            rowHeight={112}
            height={height}
            width={width}
            autoHeight
            scrollToColumn={currentIndex}
            scrollToAlignment={'center'}
            style={{
              padding: '0 16px',
            }}
          />
        )}
      </WindowScroller>
    </Box>
  )
}

export default PictureList