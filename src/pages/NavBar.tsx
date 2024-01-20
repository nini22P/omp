import { Box, Typography, Container, IconButton, useMediaQuery } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import useUiStore from '../store/useUiStore'

const NavBar = () => {
  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen]
  )
  const windowControlsOverlayOpen = useMediaQuery('(display-mode: window-controls-overlay)')

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 'env(titlebar-area-y, 0)',
        left: 'env(titlebar-area-x, 0rem)',
        width: 'env(titlebar-area-width, 100%)',
        height: 'env(titlebar-area-height, 3.5rem)',
      }}
      className='app-region-drag'
    >
      <Container
        maxWidth={'xl'}
        disableGutters={true}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100%',
          px: { xs: '0.5rem', sm: windowControlsOverlayOpen ? '0.25rem' : '1.5rem' },
          py: 'calc(env(titlebar-area-height, 0.5rem) - env(titlebar-area-height, 0rem) + 0.25rem)',
        }}
      >

        <IconButton
          onClick={() => updateMobileSideBarOpen(!mobileSideBarOpen)}
          sx={{ display: { xs: '', sm: 'none' } }}
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
      </Container>
    </Box>
  )
}

export default NavBar
