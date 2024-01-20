import { Outlet, useLocation } from 'react-router-dom'
import { Container, ThemeProvider, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import NavBar from './pages/NavBar'
import Player from './pages/Player/Player'
import SideBar from './pages/SideBar/SideBar'
import MobileSideBar from './pages/SideBar/MobileSideBar'
import useUser from './hooks/graph/useUser'
import useTheme from './hooks/ui/useTheme'
import useSync from './hooks/graph/useSync'
import useThemeColor from './hooks/ui/useThemeColor'
import LogIn from './pages/LogIn'
import useUiStore from './store/useUiStore'
import { useSpring, animated } from '@react-spring/web'
import { useMemo } from 'react'

const App = () => {
  const theme = useTheme()
  const { account } = useUser()
  useSync()
  useThemeColor()

  const [coverColor] = useUiStore((state) => [state.coverColor])
  const [{ background }, api] = useSpring(
    () => ({
      background: `linear-gradient(45deg, ${coverColor}33, ${coverColor}15, ${coverColor}05, ${theme.palette.background.default})`,
    })
  )
  useMemo(
    () => api.start({
      background: `linear-gradient(45deg, ${coverColor}33, ${coverColor}15, ${coverColor}05, ${theme.palette.background.default})`
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coverColor, theme.palette.background.default]
  )

  const location = useLocation()
  const needLogin = useMemo(
    () => (['/', '/history'].includes(location.pathname)) && !account,
    [location, account]
  )

  return (
    <ThemeProvider theme={theme}>
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
            <Grid
              xs={0}
              sm={3}
              lg={2}
              sx={{
                overflowY: 'auto',
                display: { xs: 'none', sm: 'block' },
                padding: '0 0 0.5rem 0.5rem',
                paddingTop: 'calc(env(titlebar-area-height, 3rem) + 0.5rem)',
                height: 'calc(100dvh - 4.5rem - env(titlebar-area-height, 2rem))',
              }}
            >
              <SideBar />
            </Grid>
            <Grid
              xs={12}
              sm={9}
              lg={10}
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
                  backgroundColor: `${theme.palette.background.paper}99`,
                  '& ::-webkit-scrollbar': {
                    width: '12px',
                    height: '12px',
                  },
                  '& ::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                  '& ::-webkit-scrollbar-thumb': {
                    background: theme.palette.primary.main,
                    borderRadius: '16px',
                    border: '3.5px solid transparent',
                    backgroundClip: 'content-box',
                  },
                }}>
                {needLogin ? <LogIn /> : <Outlet />}
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Player />

      </animated.div>
    </ThemeProvider>
  )
}

export default App