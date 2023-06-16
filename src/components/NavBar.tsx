import { Box, Typography, Button, Link, Container } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
// import { useState } from 'react'


const NavBar = ({ accounts, handleLogout }: { accounts: any, handleLogout: () => void }) => {

  // const [value, setValue] = useState(0)

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue)
  // }

  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, width: '100%', boxShadow: '0px 4px 4px -2px rgba(0, 0, 0, 0.1)'
    }}>
      <Container maxWidth={'xl'} disableGutters={true}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 2, pr: 2, height: '3rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <img src='./logo.svg' style={{ height: '1.5rem', marginRight: '0.5rem' }}></img>
            <Typography variant="h6" component="div" >
              OMP
            </Typography>
          </Box>
          {/* <div >
            {
              (accounts.length !== 0) &&
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav"
              >
                <Tab label="HOME" />
                <Tab label="PLAYLIST" />
              </Tabs>
            }
          </div> */}
          <div >
            {
              (accounts.length !== 0)
                ?
                <Button onClick={() => handleLogout()}>sign out</Button>
                :
                <Link href='https://github.com/nini22P/omp'>
                  <GitHubIcon />
                </Link>
            }
          </div>
        </Box>
      </Container>
    </Box>
  )
}

export default NavBar