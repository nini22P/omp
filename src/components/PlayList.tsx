import { Button, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import usePlayListStore from '../store/usePlayListStore'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import useUiStore from '../store/useUiStore'

const PlayList = () => {

  const [playList, updateIndex] = usePlayListStore((state) => [
    state.playList,
    state.updateIndex,
  ])

  const [playListIsShow, updatePlayListIsShow] = useUiStore((state) => [
    state.playListIsShow,
    state.updatePlayListIsShow,
  ])

  return (
    <Drawer
      anchor={'right'}
      open={playListIsShow}
      onClose={() => updatePlayListIsShow(false)}
      elevation={0}
      PaperProps={{
        sx: {
          backgroundColor: 'rgb(250, 250, 250, .25)',
          backdropFilter: 'blur(10px)',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgb(150, 150, 150, .25)'
        }
      }}
    >
      <Grid container wrap='nowrap' height={'100dvh'} >
        <Grid height={'100dvh'}>
          <Button sx={{ height: '100dvh', color: '#000' }} onClick={() => updatePlayListIsShow(false)}>
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
                  <ListItemButton key={index} onClick={() => updateIndex(index)} >
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