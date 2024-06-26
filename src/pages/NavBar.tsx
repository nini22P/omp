import { Box, Typography, Container, IconButton, useMediaQuery, useTheme } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import useUiStore from '../store/useUiStore'
import Search from './Search'

const NavBar = () => {
  const [mobileSideBarOpen, audioViewIsShow, videoViewIsShow, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.audioViewIsShow, state.videoViewIsShow, state.updateMobileSideBarOpen]
  )
  const windowControlsOverlayOpen = useMediaQuery('(display-mode: window-controls-overlay)')
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 'env(titlebar-area-y, 0)',
        left: 'env(titlebar-area-x, 0rem)',
        // width: 'env(titlebar-area-width, 100%)',
        right: 0,
        height: 'env(titlebar-area-height, 3.5rem)',
      }}
      className='app-region-drag'
    >
      <Container
        maxWidth={'xl'}
        disableGutters={true}
        sx={{
          top: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          px: { xs: windowControlsOverlayOpen ? 0 : '0.5rem', sm: windowControlsOverlayOpen ? '0.25rem' : '1.5rem' },
          py: 'calc(env(titlebar-area-height, 0.5rem) - env(titlebar-area-height, 0rem) + 0.25rem)',
          gap: '0.5rem',
        }}
      >
        {/* 搜索栏 */}
        <Box
          sx={{
            display: windowControlsOverlayOpen ? 'flex' : { xs: 'flex', sm: 'none' },
            position: 'absolute',
            alignItems: 'center',
            height: '100%',
            left: 'env(titlebar-area-x, 0rem)',
            width: {
              xs: windowControlsOverlayOpen ? 'env(titlebar-area-width)' : '100%',
              md: '100%',
            },
            px: windowControlsOverlayOpen ? '0' : '0.5rem',
            justifyContent: { xs: 'flex-end', sm: windowControlsOverlayOpen ? 'flex-end' : 'center', md: 'center' }
          }}
        >
          <Box sx={{ width: { xs: 'none', sm: '40%' } }} className={(audioViewIsShow || videoViewIsShow) ? 'app-region-drag' : 'app-region-no-drag'}>
            <Search type={sm ? 'bar' : 'icon'} />
          </Box>
        </Box>

        {/* 标题 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <IconButton
            onClick={() => updateMobileSideBarOpen(!mobileSideBarOpen)}
            sx={{
              display: { xs: '', sm: 'none' },
              borderRadius: '0.2rem',
              '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                borderRadius: '0.2rem',
              },
            }}
            className='app-region-no-drag'
          >
            <MenuRoundedIcon />
          </IconButton>
          <img
            src='./logo.svg'
            alt='logo'
            style={{
              height: '100%',
              marginRight: windowControlsOverlayOpen ? '0.125rem' : '0.6125rem',
            }}
          />
          <Typography
            component="div"
            fontSize={windowControlsOverlayOpen ? '1rem' : '1.25rem'}
          >
            OMP
          </Typography>
        </Box>
      </Container >
    </Box >
  )
}

export default NavBar
