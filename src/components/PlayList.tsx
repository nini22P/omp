import { Button, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { shallow } from 'zustand/shallow'
import usePlayListStore from '../store/usePlayListStore'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import useUiStore from '../store/useUiStore'

const PlayList = () => {

  const [playList, current, updateCurrent] = usePlayListStore((state) => [state.playList, state.current, state.updateCurrent], shallow)

  const [playListIsShow, updatePlayListIsShow] = useUiStore((state) => [state.playListIsShow, state.updatePlayListIsShow], shallow)

  return (
    <Drawer
      anchor={'right'}
      open={playListIsShow}
      onClose={() => updatePlayListIsShow(false)}
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
          <Button sx={{ height: '100dvh' }} onClick={() => updatePlayListIsShow(false)}>
            <KeyboardArrowRightOutlinedIcon />
          </Button>
        </Grid>
        <Grid>
          <List
            sx={{ p: 0 }}
          >
            {
              <div style={{ height: '100dvh', overflowY: 'auto' }}>
                {playList?.map((playListItem, index) =>
                  <ListItemButton
                    key={index}
                    onClick={() => updateCurrent(playListItem.index)}
                    style={(playListItem.index === current) ? { borderLeft: 'solid' } : {}}
                  >
                    <ListItemText primary={playListItem.title} />
                  </ListItemButton>)}
              </div>
            }
          </List>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default PlayList