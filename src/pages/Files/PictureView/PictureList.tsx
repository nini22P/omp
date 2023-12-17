import usePictureStore from '@/store/usePictureStore'
import { Box } from '@mui/material'
import PictureListItem from './PictureListItem'
import { Grid, WindowScroller } from 'react-virtualized'
import { CSSProperties, Key } from 'react'

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

  const cellRenderer = ({ columnIndex, key, style }: { columnIndex: number, key: Key, style: CSSProperties }) =>
    <Box key={key} style={style} sx={{ padding: '2px 4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PictureListItem picture={pictureList[columnIndex]} />
    </Box>

  const currentIndex = pictureList.findIndex(picture => picture.id === currentPicture?.id)

  return (
    <Box
      position={'absolute'}
      bottom={0}
      display={'flex'}
      flexDirection={'row'}
      flexWrap={'nowrap'}
      width={'100%'}
      overflow={'auto'}
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
              padding: '0 16px',
            }}
          />
        )}
      </WindowScroller>,

    </Box>
  )
}

export default PictureList