import { createHashRouter } from 'react-router-dom'
import App from './App'
import ListView from './components/ListView'
import NotFound from './components/NotFound'
import History from './components/History'
import PlayList from './components/PlayList'

const router = createHashRouter([
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
        path: '/history',
        element: <History />
      },
      {
        path: '/playlist/:id',
        element: <PlayList />
      },
    ]
  },
])

export default router