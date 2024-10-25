import { Box, Button, Drawer, useTheme } from '@mui/material'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import CommonList from '@/components/CommonList/CommonList'
import usePlayerStore from '@/store/usePlayerStore'
import useCustomTheme from '@/hooks/ui/useCustomTheme'
import { useShallow } from 'zustand/shallow'

const PlayQueue = () => {

  const { scrollbarStyle } = useCustomTheme()
  const theme = useTheme()

  const [
    currentIndex,
    playQueue,
    updateCurrentIndex,
    updatePlayQueue,
  ] = usePlayQueueStore(
    useShallow(
      (state) => [
        state.currentIndex,
        state.playQueue,
        state.updateCurrentIndex,
        state.updatePlayQueue,
      ]
    )
  )

  const [
    playQueueIsShow,
    updatePlayQueueIsShow
  ] = useUiStore(
    useShallow(
      (state) => [
        state.playQueueIsShow,
        state.updatePlayQueueIsShow,
      ]
    )
  )

  const updatePlayStatu = usePlayerStore(state => state.updatePlayStatu)

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
          width: { xs: 'calc(100vw - 0.5rem)', sm: '400px' }
        },
        ...scrollbarStyle
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', }} >
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {
            playQueue &&
            <CommonList
              listData={playQueue}
              listType='playQueue'
              activeIndex={playQueue?.findIndex((item) => item.index === currentIndex)}
              scrollIndex={playQueue?.findIndex((item) => item.index === currentIndex)}
              func={{ open, remove }}
            />
          }
        </Box>
        <Box sx={{ width: '100%', flexGrow: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button fullWidth size='large' onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightRoundedIcon />
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default PlayQueue