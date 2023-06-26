import { Button, Drawer, List, ListItemButton, ListItemText, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import useUiStore from '../../store/useUiStore'

const PlayQueue = () => {
  const theme = useTheme()
  const [playQueue, current, updateCurrent] = usePlayQueueStore((state) => [state.playQueue, state.current, state.updateCurrent], shallow)
  const [playQueueIsShow, updatePlayQueueIsShow] = useUiStore((state) => [state.playQueueIsShow, state.updatePlayQueueIsShow], shallow)

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      elevation={0}
      // sx={{ transform: 'translateZ(0)' }}  // blur 性能优化
      PaperProps={{
        sx: {
          // backgroundColor: 'rgb(250, 250, 250, 0.9)',
          // backdropFilter: 'blur(10px)',
        }
      }}

      BackdropProps={{
        sx: {
          // backgroundColor: 'rgb(150, 150, 150, .25)'
        }
      }}
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
              <div style={{ height: '100dvh', overflowY: 'auto' }}>
                {playQueue?.map((playQueueItem, index) =>
                  <ListItemButton
                    key={index}
                    onClick={() => updateCurrent(playQueueItem.index)}
                    style={(playQueueItem.index === current) ? { color: theme.palette.primary.main } : {}}
                  >
                    <ListItemText primary={playQueueItem.title} />
                  </ListItemButton>)}
              </div>
            }
          </List>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default PlayQueue