import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { Outlet } from 'react-router-dom'
import { Container, ThemeProvider, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import NavBar from './pages/NavBar'
import Player from './pages/Player/Player'
import SideBar from './pages/SideBar/SideBar'
import MobileSideBar from './pages/SideBar/MobileSideBar'
import useUser from './hooks/graph/useUser'
import useTheme from './hooks/ui/useTheme'
import useSync from './hooks/graph/useSync'
import useThemeColor from './hooks/ui/useThemeColor'
import SignIn from './pages/SignIn'

const App = () => {
  const theme = useTheme()
  const { accounts } = useUser()
  useSync(accounts)
  useThemeColor()

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100vw', height: '100dvh', background: theme.palette.background.default }}>
        <NavBar accounts={accounts} />
        <AuthenticatedTemplate>
          <Box sx={{ position: 'absolute', height: 'calc(100dvh - 6.5rem - env(titlebar-area-height, 3rem))', width: '100%', top: 'env(titlebar-area-height, 3rem)', }}>
            <Container maxWidth="xl" disableGutters={true} sx={{ height: '100%' }}>
              <MobileSideBar />
              <Grid container sx={{ flexDirection: 'row', height: '100%', paddingTop: '0.25rem' }}>
                <Grid xs={0} sm={3} lg={2} height={'100%'} sx={{ overflowY: 'auto', display: { xs: 'none', sm: 'block' }, }} pb={1} >
                  <SideBar />
                </Grid>
                <Grid xs={12} sm={9} lg={10} height={'100%'} sx={{ padding: '0 0.5rem 0.5rem 0.5rem' }}>
                  <Paper sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <Outlet />
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
          <Player />
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <SignIn />
        </UnauthenticatedTemplate>

      </Box>
    </ThemeProvider>
  )
}

export default App