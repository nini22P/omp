import { Button, Drawer } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import useUiStore from '../../store/useUiStore'
import CommonList from '../../components/CommonList/CommonList'

const PlayQueue = () => {

  const [playQueue, removeFilesFromPlayQueue] = usePlayQueueStore((state) => [state.playQueue, state.removeFilesFromPlayQueue])
  const [playQueueIsShow, updatePlayQueueIsShow] = useUiStore((state) => [state.playQueueIsShow, state.updatePlayQueueIsShow])

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      elevation={0}
    >
      <Grid container wrap='nowrap' height={'100dvh'} width={{ xs: '100vw', sm: '400px', md: '500px' }}>
        <Grid height={'100%'} className='app-region-no-drag'>
          <Button sx={{ height: '100dvh' }} onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightOutlinedIcon />
          </Button>
        </Grid>
        <Grid xs sx={{ height: '100%', overflowY: 'auto' }} className='pt-titlebar-area-height app-region-no-drag'>
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