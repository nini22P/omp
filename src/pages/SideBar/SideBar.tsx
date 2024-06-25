import { t } from '@lingui/macro'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HistoryRoundedIcon from '@mui/icons-material/HistoryOutlined'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import FolderRoundedIcon from '@mui/icons-material/FolderRounded'
import useUiStore from '../../store/useUiStore'
import Playlists from './Playlists'
import { useRef } from 'react'

const SideBar = () => {

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
      }}
      ref={boxRef}
      onTouchStart={() => showScrollbar()}
      onTouchEnd={() => hiddenScrollbar()}
    >
      <List disablePadding>
        {
          navData.map((item, index) =>
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