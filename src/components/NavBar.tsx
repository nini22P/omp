import { AppBar, Box, Toolbar, Typography, Button, Link } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

const NavBar = ({ accounts, handleLogout }: { accounts: any, handleLogout: () => void }) => {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            color: '#000',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Toolbar>
            <img src='./logo.svg' style={{ height: '2rem', marginRight: '1rem' }}></img>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              OMP
            </Typography>
            {
              (accounts.length !== 0)
                ?
                <Button onClick={() => handleLogout()}>sign out</Button>
                :
                <Link href='https://github.com/nini22P/omp'>
                  <GitHubIcon sx={{ color: '#000' }} />
                </Link>
            }
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

export default NavBar