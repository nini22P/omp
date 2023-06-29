import { useTranslation } from 'react-i18next'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import Playlists from './Playlists'
import useTheme from '../../hooks/useTheme'

const SideBar = () => {

  const { t } = useTranslation()
  const { styles } = useTheme()

  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen],
    shallow
  )

  const closeSideBar = () => (mobileSideBarOpen) && updateMobileSideBarOpen(false)

  return (
    <div>
      <List >
        <ListItem disablePadding={true}>
          <ListItemButton
            component={NavLink}
            sx={styles.listItemActive}
            to={'/'}
            onClick={closeSideBar}>
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav.home')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding={true}>
          <ListItemButton
            component={NavLink}
            sx={styles.listItemActive}
            to={'/history'}
            onClick={closeSideBar}>
            <ListItemIcon >
              <HistoryOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav.history')} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Playlists closeSideBar={closeSideBar} />
    </div>
  )
}
export default SideBar