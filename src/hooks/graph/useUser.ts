import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/graph/authConfig'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'

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
    usePlayQueueStore.persist.clearStorage()
    useUiStore.persist.clearStorage()
    instance.logoutRedirect({
      postLogoutRedirectUri: '/'
    })
  }

  return { instance, accounts, login, logout }
}

export default useUser