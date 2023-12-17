import usePictureStore from '@/store/usePictureStore'
import { Box } from '@mui/material'
import PictureListItem from './PictureListItem'
import { Grid, WindowScroller } from 'react-virtualized'
import { CSSProperties, Key, useEffect, useState } from 'react'

const PictureList = () => {
  const [
    pictureList,
    currentPicture,
  ] = usePictureStore(
    state => [
      state.pictureList,
      state.currentPicture,
    ]
  )

  const currentIndex = pictureList.findIndex(picture => picture.id === currentPicture?.id)

  const [pictureListIsShow, setPictureListIsShow] = useState(true)

  useEffect(
    () => {
      let timer: string | number | NodeJS.Timeout | undefined
      const resetTimer = () => {
        setPictureListIsShow(true)
        clearTimeout(timer)
        timer = (setTimeout(() => setPictureListIsShow(false), 5000))
      }
      resetTimer()
      window.addEventListener('mousemove', resetTimer)
      window.addEventListener('mousedown', resetTimer)
      window.addEventListener('keydown', resetTimer)
      return () => {
        window.removeEventListener('mousemove', resetTimer)
        window.removeEventListener('mousedown', resetTimer)
        window.removeEventListener('keydown', resetTimer)
        clearTimeout(timer)
      }
    },
    []
  )

  const cellRenderer = ({ columnIndex, key, style }: { columnIndex: number, key: Key, style: CSSProperties }) =>
    <Box key={key} style={style} sx={{ padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PictureListItem picture={pictureList[columnIndex]} />
    </Box>

  return (
    <Box
      position={'absolute'}
      bottom={0}
      display={'flex'}
      flexDirection={'row'}
      flexWrap={'nowrap'}
      width={'100%'}
      overflow={'auto'}
      height={pictureListIsShow ? 'auto' : 0}
    >
      <WindowScroller>
        {({ height, width }) => (
          <Grid
            cellRenderer={cellRenderer}
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
              padding: '0 16px 8px 16px',
            }}
          />
        )}
      </WindowScroller>,

    </Box>
  )
}

export default PictureList