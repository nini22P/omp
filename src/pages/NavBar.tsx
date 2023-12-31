import { Box, Typography, Link, Container, IconButton } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
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
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          px: { xs: '0.5rem', sm: 'calc(env(titlebar-area-height, 1.25rem) - env(titlebar-area-height, 0rem) + 0.25rem)' },
          py: 'calc(env(titlebar-area-height, 0.5rem) - env(titlebar-area-height, 0rem) + 0.25rem)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%', }} >
          {
            (accounts.length !== 0) &&
            <IconButton
              onClick={() => updateMobileSideBarOpen(!mobileSideBarOpen)}
              sx={{ display: { xs: '', sm: 'none' } }}
              className='app-region-no-drag'
            >
              <MenuRoundedIcon />
            </IconButton>
          }
          <img
            src='./logo.svg'
            alt='logo'
            style={{
              height: '100%',
              marginRight: 'calc(env(titlebar-area-height, 0.5rem) - env(titlebar-area-height, 0rem) + 0.125rem)',
            }}
          />
          <Typography
            component="div"
            fontSize={'calc(env(titlebar-area-height, 0.25rem) - env(titlebar-area-height, 0rem) + 1rem)'}
          >
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
      </Container>
    </Box>
  )
}

export default NavBar
