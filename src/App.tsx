import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { Outlet } from 'react-router-dom'
import { Container, Divider, ThemeProvider, Box } from '@mui/material'
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
  const { theme } = useTheme()
  const { accounts } = useUser()
  useSync(accounts)
  useThemeColor()

  return (
    <ThemeProvider theme={theme}>
      <NavBar accounts={accounts} />

      <AuthenticatedTemplate>
        <Box sx={{ position: 'absolute', height: 'calc(100dvh - 6rem - env(titlebar-area-height, 3rem))', width: '100%', top: 'env(titlebar-area-height, 3rem)', }}>
          <Container maxWidth="xl" disableGutters={true} sx={{ height: '100%' }}>
            <MobileSideBar />
            <Grid container flexDirection={'row'} height={'100%'}  >
              <Grid xs={0} sm={3} lg={2} height={'100%'} sx={{ overflowY: 'auto', display: { xs: 'none', sm: 'block' }, }} pb={1} borderRight={`1px solid ${theme.palette.divider}`} borderLeft={`1px solid ${theme.palette.divider}`} >
                <SideBar />
                <Divider orientation="vertical" flexItem />
              </Grid>
              <Grid xs={12} sm={9} lg={10} pt={1} pb={3} height={'100%'} sx={{ overflowY: 'auto' }} borderRight={`1px solid ${theme.palette.divider}`} >
                <Outlet />
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Player />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <SignIn />
      </UnauthenticatedTemplate>

    </ThemeProvider>
  )
}

export default App