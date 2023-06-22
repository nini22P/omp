import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ListView from './components/ListView'
import NotFound from './components/NotFound'
import History from './components/History'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <ListView />
      },
      {
        path: 'history',
        element: <History />
      }
    ]
  },
])

export default router