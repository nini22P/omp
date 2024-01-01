import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/graph/authConfig'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import { AccountInfo } from '@azure/msal-browser'

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
      postLogoutRedirectUri: '/',
    })
    location.reload()
  }

  const account: AccountInfo | null = accounts[0] || null

  return { account, login, logout }
}

export default useUser