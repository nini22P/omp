import useUiStore from '@/store/useUiStore'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { Box, IconButton, ListItemText, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

const MenuButton = () => {

  const [audioViewTheme, updateAudioViewTheme] = useUiStore(state => [state.audioViewTheme, state.updateAudioViewTheme])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setMenuOpen(false)
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
        <MenuItem onClick={handleClickSwitchTheme}>
          <ListItemText primary={'切换主题'} />
        </MenuItem>

      </Menu>

    </Box>

  )
}

export default MenuButton