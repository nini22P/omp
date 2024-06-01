import useUiStore from '@/store/useUiStore'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const MenuButton = () => {

  const [
    audioViewTheme,
    playbackRate,
    updateAudioViewTheme,
    updatePlaybackRate,
  ] = useUiStore(state => [
    state.audioViewTheme,
    state.playbackRate,
    state.updateAudioViewTheme,
    state.updatePlaybackRate,
  ])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuStatus, setMenuStatus] = useState<null | 'playbackRate'>(null)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setMenuOpen(false)
    setMenuStatus(null)
  }

  const handleClickSwitchTheme = () => {
    if (audioViewTheme === 'classic')
      updateAudioViewTheme('modern')
    else
      updateAudioViewTheme('classic')
  }

  return (
    <Box>
      <IconButton onClick={(event) => handleClickMenu(event)}>
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        {
          (!menuStatus) &&
          <div>
            <MenuItem onClick={handleClickSwitchTheme}>
              <ListItemIcon>
                <SyncAltRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={'切换主题'} />
            </MenuItem>
            <MenuItem onClick={() => setMenuStatus('playbackRate')}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ListItemIcon>
                  <SpeedRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={'播放速度'} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                {playbackRate.toFixed(2)} <NavigateNextRoundedIcon />
              </Box>
            </MenuItem>
          </div>
        }

        {
          (menuStatus === 'playbackRate') &&
          <div>
            <MenuItem onClick={() => setMenuStatus(null)}>
              <ListItemIcon>
                <NavigateBeforeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={'播放速度'} />
            </MenuItem>
            {
              [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4].map((speed) => (
                <MenuItem
                  key={speed}
                  onClick={() => {
                    updatePlaybackRate(speed)
                    setMenuStatus(null)
                  }}
                >
                  <ListItemIcon>
                    <CheckRoundedIcon sx={{ visibility: speed === playbackRate ? 'visible' : 'hidden' }} />
                  </ListItemIcon>
                  {speed.toFixed(2)}
                </MenuItem>
              ))
            }
          </div>
        }

      </Menu>

    </Box>

  )
}

export default MenuButton