import { useRouteError } from 'react-router-dom'

const NotFound = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div>
      <h1>404</h1>
      <p>Not Found</p>
    </div>
  )
}

export default NotFound