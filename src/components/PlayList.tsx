import { Button, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import usePlayListStore from '../store/usePlayListStore'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'

const PlayList = () => {

  const [playList, playListIsShow, updateIndex, updatePlayListIsShow] = usePlayListStore((state) => [
    state.playList,
    state.playListIsShow,
    state.updateIndex,
    state.updatePlayListIsShow,
  ])
  return (
    <div>
      <Drawer
        anchor={'right'}
        open={playListIsShow}
        onClose={() => updatePlayListIsShow(false)}
        elevation={0}
        PaperProps={{
          sx: {
            backgroundColor: 'rgb(250, 250, 250, .25)',
            backdropFilter: 'blur(10px)'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgb(250, 250, 250, .25)'
          }
        }}
      >
        <Grid container wrap='nowrap' >
          <Grid height={'100dvh'}>
            <Button sx={{ height: '100dvh', color: '#000' }} onClick={() => updatePlayListIsShow(false)}>
              <KeyboardArrowRightOutlinedIcon />
            </Button>
          </Grid>
          <Grid>
            <List>
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
    </div>
  )
}

export default PlayList