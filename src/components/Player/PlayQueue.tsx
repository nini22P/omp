import { Box, Button, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import useUiStore from '../../store/useUiStore'
import useTheme from '../../hooks/useTheme'

const PlayQueue = () => {

  const { styles } = useTheme()

  const [playQueue, currentIndex, updateCurrentIndex] = usePlayQueueStore(
    (state) => [state.playQueue, state.currentIndex, state.updateCurrentIndex],
    shallow
  )
  const [playQueueIsShow, updatePlayQueueIsShow] = useUiStore(
    (state) => [state.playQueueIsShow, state.updatePlayQueueIsShow],
    shallow
  )

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      elevation={0}
    >
      <Grid container wrap='nowrap' height={'100dvh'} >
        <Grid height={'100dvh'}>
          <Button sx={{ height: '100dvh' }} onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightOutlinedIcon />
          </Button>
        </Grid>
        <Grid>
          <List
            sx={{ p: 0 }}
          >
            {
              <Box sx={{ height: '100dvh', overflowY: 'auto' }}>
                {playQueue?.map((playQueueItem, index) =>
                  <ListItemButton
                    key={index}
                    onClick={() => updateCurrentIndex(playQueueItem.index)}
                    style={(playQueueItem.index === currentIndex) ? { color: styles.color.primary } : {}}
                  >
                    <ListItemText primary={playQueueItem.title} />
                  </ListItemButton>)}
              </Box>
            }
          </List>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default PlayQueue