import { Button, Drawer } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import CommonList from '@/components/CommonList/CommonList'
import useTheme from '@/hooks/ui/useTheme'

const PlayQueue = () => {

  const { styles } = useTheme()

  const [playQueue, removeFilesFromPlayQueue] = usePlayQueueStore((state) => [state.playQueue, state.removeFilesFromPlayQueue])
  const [playQueueIsShow, updatePlayQueueIsShow] = useUiStore((state) => [state.playQueueIsShow, state.updatePlayQueueIsShow])

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      elevation={0}
      sx={{
        '& .MuiDrawer-paper': {
          // paddingTop: 'env(titlebar-area-height, 0)',
          marginTop: 'calc(env(titlebar-area-height, 0) + 1px)',
          boxShadow: `-5px 5px 10px 0px ${styles.color.shadow}`,
          borderRadius: '10px 0 0 10px',
          height: '-webkit-fill-available',
          borderLeft: `${styles.color.shadow} solid 1px`,
        },
        '& .MuiBackdrop-root': {
          background: 'transparent',
        }
      }}
    >
      <Grid container wrap='nowrap' height={'-webkit-fill-available'} width={{ xs: '100vw', sm: '400px', md: '500px' }}>
        <Grid height={'100%'} className='app-region-no-drag'>
          <Button sx={{ height: '-webkit-fill-available' }} onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightOutlinedIcon />
          </Button>
        </Grid>
        <Grid xs sx={{ height: '100%', overflowY: 'auto', paddingY: '1rem' }}>
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