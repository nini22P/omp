import { useMsal } from "@azure/msal-react"

const SignOutButton = () => {
  const { instance } = useMsal()

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/"
    })
  }

  return (
    <button onClick={() => handleLogout()}>Sign out</button>
  )
}

export default SignOutButton