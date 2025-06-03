import { Outlet, useLocation } from 'react-router-dom'
import { Container, ThemeProvider, Paper, Box, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import NavBar from './pages/NavBar'
import Player from './pages/Player/Player'
import SideBar from './pages/SideBar/SideBar'
import MobileSideBar from './pages/SideBar/MobileSideBar'
import useUser from './hooks/graph/useUser'
import useSync from './hooks/graph/useSync'
import useThemeColor from './hooks/ui/useThemeColor'
import LogIn from './pages/LogIn'
import useUiStore from './store/useUiStore'
import { useSpring, animated } from '@react-spring/web'
import { useMemo } from 'react'
import useCustomTheme from './hooks/ui/useCustomTheme'
import Search from './pages/Search'
import useStyles from './hooks/ui/useStyles'

const App = () => {
  const customTheme = useCustomTheme()
  const styles = useStyles(customTheme)
  useThemeColor(customTheme)
  const windowControlsOverlayOpen = useMediaQuery('(display-mode: window-controls-overlay)')

  const { account } = useUser()
  useSync()

  const coverColor = useUiStore((state) => state.coverColor)

  const [{ background }, api] = useSpring(
    () => ({
      background: `linear-gradient(45deg, ${coverColor}33, ${coverColor}15, ${coverColor}05, ${customTheme.palette.background.default})`,
    })
  )
  useMemo(
    () => api.start({
      background: `linear-gradient(45deg, ${coverColor}33, ${coverColor}15, ${coverColor}05, ${customTheme.palette.background.default})`
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coverColor, customTheme.palette.background.default]
  )

  const location = useLocation()
  const needLogin = useMemo(
    () => (['/', '/history'].includes(location.pathname)) && !account,
    [location, account]
  )

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={styles.scrollbar}>
        <animated.div
          style={{
            width: '100vw',
            height: '100dvh',
            background: background,
          }}
        >
          <NavBar />

          <Container maxWidth="xl" disableGutters={true} sx={{ height: '100%' }}>
            <MobileSideBar />
            <Grid container>
              {/* 侧栏 */}
              <Grid
                size={{ xs: 0, sm: 3, lg: 2 }}
                sx={{
                  // overflowY: 'auto',
                  display: { xs: 'none', sm: 'block' },
                  padding: '0 0 0.5rem 0.5rem',
                  paddingTop: 'calc(env(titlebar-area-height, 3rem) + 0.5rem)',
                  height: 'calc(100dvh - 4.5rem - env(titlebar-area-height, 4.5rem))',
                }}
              >
                {
                  <Box sx={{
                    height: '2.5rem',
                    padding: '0.25rem',
                    display: windowControlsOverlayOpen ? 'none' : 'block',
                  }}
                  >
                    <Search type='bar' />
                  </Box>
                }
                <SideBar />
              </Grid>

              {/* 主体内容 */}
              <Grid
                size={{ xs: 12, sm: 9, lg: 10 }}
                sx={{
                  padding: '0 0.5rem 0.5rem 0.5rem',
                  paddingTop: {
                    xs: 'calc(env(titlebar-area-height, 3rem) + 0.5rem)',
                    sm: 'calc(env(titlebar-area-height, 0rem) + 0.5rem)'
                  },
                  height: 'calc(100dvh - 4.5rem - env(titlebar-area-height, 2rem))',
                }}
              >
                <Paper
                  sx={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: `${customTheme.palette.background.paper}99`
                  }}>
                  {needLogin ? <LogIn /> : <Outlet />}
                </Paper>
              </Grid>
            </Grid>
          </Container>

          <Player />

        </animated.div>
      </Box>
    </ThemeProvider>
  )
}

export default App