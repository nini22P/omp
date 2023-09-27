import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../services/authConfig'

const useUser = () => {
  const { instance, accounts } = useMsal()

  // 登入
  const login = () => {
    instance.loginRedirect(loginRequest)
      .catch(e => {
        console.log(e)
      })
  }

  //登出
  const logout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/'
    })
  }

  return { instance, accounts, login, logout }
}

export default useUser