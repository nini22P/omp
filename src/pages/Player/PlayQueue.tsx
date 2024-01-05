import { Button, Drawer } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import CommonList from '@/components/CommonList/CommonList'

const PlayQueue = () => {

  const [
    currentIndex,
    playQueue,
    removeFilesFromPlayQueue
  ] = usePlayQueueStore(
    (state) => [
      state.currentIndex,
      state.playQueue,
      state.removeFilesFromPlayQueue,
    ]
  )

  const [
    playQueueIsShow,
    updatePlayQueueIsShow
  ] = useUiStore(
    (state) => [
      state.playQueueIsShow,
      state.updatePlayQueueIsShow,
    ]
  )

  const currentFile = playQueue?.find((item) => item.index === currentIndex)

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: 'calc(100vw - 0.5rem)', sm: '400px', md: '500px' }
        },
      }}
    >
      <Grid container wrap='nowrap' height={'100%'} >
        <Grid height={'100%'}>
          <Button sx={{ height: '100%' }} onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightRoundedIcon />
          </Button>
        </Grid>
        <Grid xs sx={{ height: '100%', overflowY: 'auto' }}>
          {
            playQueue &&
            <CommonList
              listData={playQueue}
              listType='playQueue'
              activeFilePath={currentFile?.filePath}
              scrollFilePath={currentFile?.filePath}
              func={{ handleClickRemove: removeFilesFromPlayQueue }}
            />
          }
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default PlayQueue