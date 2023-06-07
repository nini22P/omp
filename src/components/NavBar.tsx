import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../authConfig"

const NavBar = () => {
  const { instance, accounts } = useMsal()

  // 登入
  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
      .catch(e => {
        console.log(e)
      })
  }

  //登出
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/"
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <img src='/logo.png' style={{ height: '3rem', marginRight: '1rem' }}></img>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OMP
          </Typography>
          {
            (accounts.length === 0)
              ?
              <Button color="inherit" onClick={() => handleLogin()}>sign in</Button>
              :
              <Button color="inherit" onClick={() => handleLogout()}>sign out</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar