import { Box, Typography, Link, Container, IconButton, useTheme } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import useUiStore from '../store/useUiStore'
import { shallow } from 'zustand/shallow'
import { useMsal } from '@azure/msal-react'
import useUser from '../hooks/useUser'

const NavBar = () => {
  const theme = useTheme()
  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore((state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen], shallow)
  const { accounts } = useMsal()
  const { logout } = useUser()

  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, width: '100%', boxShadow: `0px 4px 4px -2px ${theme.palette.divider} `
    }}>
      <Container maxWidth={'xl'} disableGutters={true}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem', pl: 1, pr: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <IconButton onClick={() => updateMobileSideBarOpen(!mobileSideBarOpen)} sx={{ display: { xs: '', sm: 'none' } }}>
              <MenuOutlinedIcon />
            </IconButton>
            <img src='./logo.svg' style={{ height: '1.5rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}></img>
            <Typography variant="h6" component="div" >
              OMP
            </Typography>
          </Box>
          <div >
            {
              (accounts.length !== 0)
                ?
                <IconButton onClick={() => logout()}>
                  <LogoutIcon />
                </IconButton>
                :
                <IconButton component={Link} href='https://github.com/nini22P/omp'>
                  <GitHubIcon />
                </IconButton>
            }
          </div>
        </Box>
      </Container>
    </Box>
  )
}

export default NavBar