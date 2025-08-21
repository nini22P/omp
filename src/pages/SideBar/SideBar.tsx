import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HistoryRoundedIcon from '@mui/icons-material/HistoryOutlined'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import FolderRoundedIcon from '@mui/icons-material/FolderRounded'
import useUiStore from '../../store/useUiStore'
import Playlists from './Playlists'
import { useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { useLingui } from '@lingui/react/macro'

const SideBar = () => {
  const { t } = useLingui()

  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    useShallow((state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen])
  )

  const navData = [
    { router: '/', icon: <FolderRoundedIcon />, label: t`Files` },
    { router: '/library', icon: <FolderRoundedIcon />, label: t`Library` },
    { router: '/history', icon: <HistoryRoundedIcon />, label: t`History` },
    { router: '/setting', icon: <SettingsRoundedIcon />, label: t`Setting` },
  ]

  const closeSideBar = () => (mobileSideBarOpen) && updateMobileSideBarOpen(false)

  const boxRef = useRef<HTMLDivElement | null>(null)

  const showScrollbar = () => {
    const element = boxRef.current
    element?.classList.add('show-scrollbar')
  }

  const hiddenScrollbar = () => {
    const element = boxRef.current
    element?.classList.remove('show-scrollbar')
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