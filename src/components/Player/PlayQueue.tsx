import { Button, Drawer } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import useUiStore from '../../store/useUiStore'
import CommonList from '../CommonList/CommonList'

const PlayQueue = () => {

  const [playQueue, removeFilesFromPlayQueue] = usePlayQueueStore(
    (state) => [state.playQueue, state.removeFilesFromPlayQueue],
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
      <Grid container wrap='nowrap' height={'100dvh'} width={{ xs: '100vw', sm: '400px', md: '500px' }} >
        <Grid height={'100dvh'}>
          <Button sx={{ height: '100dvh' }} onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightOutlinedIcon />
          </Button>
        </Grid>
        <Grid xs sx={{ height: '100dvh', overflowY: 'auto' }}>
          {
            playQueue &&
            <CommonList
              listData={playQueue}
              handleClickRemove={removeFilesFromPlayQueue}
            />
          }
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default PlayQueue