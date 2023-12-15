import { Drawer } from '@mui/material'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import SideBar from './SideBar'
import useTheme from '../../hooks/ui/useTheme'

const MobileSideBar = () => {

  const { styles } = useTheme()

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
          // paddingTop: 'env(titlebar-area-height, 0)',
          marginTop: 'calc(env(titlebar-area-height, 0) + 1px)',
          boxShadow: `5px 5px 10px 0px ${styles.color.shadow}`,
          borderRadius: '0 10px 10px 0',
          height: '-webkit-fill-available',
          borderRight: `${styles.color.shadow} solid 1px`,
        },
        '& .MuiBackdrop-root': {
          background: 'transparent',
        }
      }}
    >
      <SideBar />
    </Drawer>
  )
}

export default MobileSideBar