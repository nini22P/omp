import { t } from '@lingui/macro'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HistoryRoundedIcon from '@mui/icons-material/HistoryOutlined'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import FolderRoundedIcon from '@mui/icons-material/FolderRounded'
import useUiStore from '../../store/useUiStore'
import Playlists from './Playlists'
import { useRef } from 'react'

const SideBar = () => {

  const theme = useTheme()

  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen])

  const navData = [
    { router: '/', icon: <FolderRoundedIcon />, label: t`Files` },
    { router: '/history', icon: <HistoryRoundedIcon />, label: t`History` },
    { router: '/setting', icon: <SettingsRoundedIcon />, label: t`Setting` },
  ]

  const closeSideBar = () => (mobileSideBarOpen) && updateMobileSideBarOpen(false)

  const boxRef = useRef<HTMLDivElement | null>(null)

  const showScrollbar = () => {
    const element = boxRef.current
    element && element.classList.add('show-scrollbar')
  }

  const hiddenScrollbar = () => {
    const element = boxRef.current
    element && element.classList.remove('show-scrollbar')
  }

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.main,
          borderRadius: '16px',
          border: '3.5px solid transparent',
          backgroundClip: 'content-box',
          visibility: 'hidden',
        },
        '&:hover::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      }}
      ref={boxRef}
      onTouchStart={() => showScrollbar()}
      onTouchEnd={() => hiddenScrollbar()}
    >
      <List disablePadding>
        {navData.map((item, index) =>
          <ListItem
            disablePadding
            key={index}
            sx={{ paddingBottom: '0.25rem' }}
          >
            <ListItemButton
              component={NavLink}
              to={item.router}
              onClick={closeSideBar}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        )
        }
      </List>
      <Playlists closeSideBar={closeSideBar} />
    </Box >
  )
}
export default SideBar