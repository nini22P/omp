import { Drawer, useTheme } from '@mui/material'
import useUiStore from '../../store/useUiStore'
import SideBar from './SideBar'
import { useShallow } from 'zustand/shallow'
import useStyles from '@/hooks/ui/useStyles'

const MobileSideBar = () => {

  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    useShallow((state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen])
  )

  const theme = useTheme()
  const styles = useStyles(theme)

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
        ...styles.scrollbar
      }}
    >
      <SideBar />
    </Drawer>
  )
}

export default MobileSideBar