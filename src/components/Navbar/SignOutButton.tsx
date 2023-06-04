import { useMsal } from "@azure/msal-react"

const SignOutButton = () => {
  const { instance } = useMsal()

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/"
    })
  }

  return (
    <button onClick={() => handleLogout()}>Sign out</button>
  )
}

export default SignOutButton