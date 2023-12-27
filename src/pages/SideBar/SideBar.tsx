import { useTranslation } from 'react-i18next'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import Playlists from './Playlists'
import useStyles from '@/hooks/ui/useStyles'

const SideBar = () => {

  const { t } = useTranslation()
  const styles = useStyles()

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

  return (
    <Box sx={{
      height: '100%',
      overflow: 'auto',
    }}>
      <List sx={{ padding: 0 }}>
        {navData.map((item, index) =>
          <ListItem
            disablePadding
            key={index}
          >
            <ListItemButton
              component={NavLink}
              sx={styles.navListItem}
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