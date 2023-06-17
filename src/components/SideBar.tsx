import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { shallow } from 'zustand/shallow'
import useUiStore from '../store/useUiStore'

const SideBar = () => {
  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore((state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen], shallow)
  const closeSideBar = () => {
    if (mobileSideBarOpen)
      updateMobileSideBarOpen(false)
  }
  return (
    <List >
      <ListItem disablePadding={true}>
        <ListItemButton component={NavLink} to={'/'} onClick={closeSideBar}>
          <ListItemIcon>
            <HomeOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding={true}>
        <ListItemButton component={NavLink} to={'/history'} onClick={closeSideBar}>
          <ListItemIcon>
            <HistoryOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={'History'} />
        </ListItemButton>
      </ListItem>
      <Divider />
    </List>
  )
}
export default SideBar