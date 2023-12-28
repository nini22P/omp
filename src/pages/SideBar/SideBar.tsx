import { useTranslation } from 'react-i18next'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import Playlists from './Playlists'
import { useRef } from 'react'

const SideBar = () => {

  const { t } = useTranslation()

  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen],
    shallow
  )

  const navData = [
    { router: '/', icon: <HomeOutlinedIcon />, label: t('nav.home') },
    { router: '/history', icon: <HistoryOutlinedIcon />, label: t('nav.history') },
    { router: '/setting', icon: <SettingsOutlinedIcon />, label: t('nav.setting') },
  ]

  const closeSideBar = () => (mobileSideBarOpen) && updateMobileSideBarOpen(false)

  const boxRef = useRef<HTMLDivElement | null>(null)

  const handleTouchStart = () => {
    const element = boxRef.current
    element && element.classList.add('show-scrollbar')
  }

  const handleTouchEnd = () => {
    const element = boxRef.current
    element && element.classList.remove('show-scrollbar')
  }

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar-thumb': {
          visibility: 'hidden',
        },
        '&:hover::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      }}
      ref={boxRef}
      onTouchStart={() => handleTouchStart()}
      onTouchEnd={() => handleTouchEnd()}
    >
      <List disablePadding>
        {navData.map((item, index) =>
          <ListItem
            key={index}
            sx={{ padding: '0.25rem 0.25rem 0 0.25rem' }}
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
    </Box>
  )
}
export default SideBar