import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import PlayLists from './PlayLists'

const SideBar = () => {
  const theme = useTheme()
  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore((state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen], shallow)
  const closeSideBar = () => {
    if (mobileSideBarOpen)
      updateMobileSideBarOpen(false)
  }
  const styles = {
    active: {
      '&.active': {
        color: theme.palette.primary.main,
      },
      '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
    }
  }
  return (
    <div>
      <List >
        <ListItem disablePadding={true}>
          <ListItemButton
            component={NavLink}
            sx={styles.active}
            to={'/'}
            onClick={closeSideBar}>
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={'HOME'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding={true}>
          <ListItemButton
            component={NavLink}
            sx={styles.active}
            to={'/history'}
            onClick={closeSideBar}>
            <ListItemIcon >
              <HistoryOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={'HISTORY'} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <PlayLists closeSideBar={closeSideBar} />
    </div>
  )
}
export default SideBar