import { Button, Drawer } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import CommonList from '@/components/CommonList/CommonList'
import usePlayerStore from '@/store/usePlayerStore'
import useCustomTheme from '@/hooks/ui/useCustomTheme'

const PlayQueue = () => {

  const { scrollbarStyle } = useCustomTheme()

  const [
    currentIndex,
    playQueue,
    updateCurrentIndex,
    updatePlayQueue,
  ] = usePlayQueueStore(
    (state) => [
      state.currentIndex,
      state.playQueue,
      state.updateCurrentIndex,
      state.updatePlayQueue,
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

  const [updatePlayStatu] = usePlayerStore(state => [state.updatePlayStatu])

  const currentFile = playQueue?.find((item) => item.index === currentIndex)

  const open = (index: number) => {
    if (playQueue) {
      updatePlayStatu('playing')
      updateCurrentIndex(playQueue[index].index)
    }
  }

  const remove = (indexArray: number[]) =>
    updatePlayQueue(playQueue?.filter(item => !indexArray.map(index => playQueue[index].index).filter(index => index !== currentIndex).includes(item.index)) || [])

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: 'calc(100vw - 0.5rem)', sm: '400px', md: '500px' }
        },
        ...scrollbarStyle
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
              activeIndex={playQueue?.findIndex((item) => item.index === currentIndex)}
              scrollFilePath={currentFile?.filePath}
              func={{ open, remove }}
            />
          }
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default PlayQueue