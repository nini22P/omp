import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../../authConfig"

const SignInButton = () => {
  const { instance } = useMsal()

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .catch(e => {
        console.log(e)
      })
  }
  return (
    <button onClick={() => handleLogin()}>Sign in</button>
  )
}

export default SignInButton