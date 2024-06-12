import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/graph/authConfig'
import useUiStore from '@/store/useUiStore'
import { AccountInfo } from '@azure/msal-browser'

const useUser = () => {
  const { instance, accounts } = useMsal()
  const currentAccount = useUiStore(state => state.currentAccount)

  const account: AccountInfo | null = accounts[currentAccount] || null

  // 登入
  const login = () => {
    instance.loginRedirect(loginRequest)
  }

  //登出
  const logout = (account: AccountInfo) => {
    instance.logoutRedirect({
      account: account,
      postLogoutRedirectUri: '/',
    })
  }

  return { accounts, account, login, logout }
}

export default useUser