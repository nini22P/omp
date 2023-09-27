import { useRouteError } from 'react-router-dom'

const NotFound = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div>
    </div>
  )
}

export default NotFound