import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../authConfig'

const useUser = () => {
  const { instance } = useMsal()

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

  return { login, logout }
}

export default useUser