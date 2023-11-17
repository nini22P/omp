import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Button, Container, Divider, Link, ThemeProvider, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import NavBar from './pages/NavBar'
import Player from './pages/Player/Player'
import SideBar from './pages/SideBar/SideBar'
import MobileSideBar from './pages/SideBar/MobileSideBar'
import useUser from './hooks/useUser'
import useTheme from './hooks/useTheme'
import useSync from './hooks/useSync'
import useThemeColor from './hooks/useThemeColor'

const App = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { accounts, login } = useUser()
  useSync(accounts)
  useThemeColor()

  return (
    <main>
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
          <Container
            style={{
              height: 'calc(100dvh)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              textAlign: 'center',
            }}>
            <div>{/* Don't delete this */}</div>
            <div>
              <Typography variant="h5" pb={2} >
                {t('account.signInAlert')}
              </Typography>
              <Button size="large" onClick={() => login()}>{t('account.signIn')}</Button>
            </div>
            <footer>
              Made with ❤ from <Link underline='none' href='https://github.com/nini22P'>22</Link>
            </footer>
          </Container>
        </UnauthenticatedTemplate>
      </ThemeProvider>
    </main >
  )
}

export default App