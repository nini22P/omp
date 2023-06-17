import { useRouteError } from 'react-router-dom'

const NotFound = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div>
      <h1>404</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  )
}

export default NotFound