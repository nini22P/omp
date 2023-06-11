import { Box, List, ListItemButton, ListItemText } from '@mui/material'
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
      <Box
        position={'fixed'}
        height={'100dvh'}
        right={playListIsShow ? 0 : '-100vw'}
        maxWidth={'100vw'}
        bottom={0}
        sx={{
          transition: 'all 0.25s',
          backgroundColor: 'rgb(250, 250, 250, .5)',
          boxShadow: '0px 4px 4px 4px rgba(0, 0, 0, 0.1)',
          overflowX: 'hidden',
          overflowY: 'auto',
          backdropFilter: 'blur(10px)',
        }}
      >
        <List>
          <ListItemButton onClick={() => updatePlayListIsShow(false)}>
            <KeyboardArrowRightOutlinedIcon />
          </ListItemButton>
          {
            (!playList)
              ?
              <ListItemText primary='PlayList No Item' sx={{ p: 2 }} />
              :
              <div>
                {playList.map((playListItem, index) =>
                  <ListItemButton onClick={() => updateIndex(index)} >
                    <ListItemText primary={playListItem.title} />
                  </ListItemButton>)}
                <ListItemButton onClick={() => updatePlayListIsShow(false)}>
                  <KeyboardArrowRightOutlinedIcon />
                </ListItemButton>
              </div>

          }

        </List>
      </Box>

    </div>
  )
}

export default PlayList