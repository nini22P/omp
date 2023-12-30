import { Drawer } from '@mui/material'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import SideBar from './SideBar'

const MobileSideBar = () => {

  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen],
    shallow
  )

  return (
    <Drawer
      variant="temporary"
      open={mobileSideBarOpen}
      onClose={() => updateMobileSideBarOpen(false)}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          minWidth: 260,
          maxWidth: 280,
        },
      }}
    >
      <SideBar />
    </Drawer>
  )
}

export default MobileSideBar