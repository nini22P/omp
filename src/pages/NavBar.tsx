import { Box, Typography, Link, Container, IconButton } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import { shallow } from 'zustand/shallow'
import useUiStore from '../store/useUiStore'
import { AccountInfo } from '@azure/msal-browser'

const NavBar = ({ accounts }: { accounts: AccountInfo[] }) => {
  const [mobileSideBarOpen, updateMobileSideBarOpen] = useUiStore(
    (state) => [state.mobileSideBarOpen, state.updateMobileSideBarOpen],
    shallow
  )

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
      }}
      className='app-region-drag'
    >
      <Container maxWidth={'xl'} disableGutters={true}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            left: 'env(titlebar-area-x, 0)',
            height: 'env(titlebar-area-height, 3rem)',
            px: 2.25,
            pt: 0.5,
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', }} >
            {
              (accounts.length !== 0) &&
              <IconButton
                onClick={() => updateMobileSideBarOpen(!mobileSideBarOpen)}
                sx={{ display: { xs: '', sm: 'none' } }}
                className='app-region-no-drag'
              >
                <MenuOutlinedIcon />
              </IconButton>
            }
            <img src='./logo.svg' alt='logo' style={{ height: '100%', marginLeft: '0.5rem', marginRight: '0.75rem' }} ></img>
            <Typography variant="h6" component="div" >
              OMP
            </Typography>
          </Box>
          <div >
            {
              (accounts.length == 0) &&
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
