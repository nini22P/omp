import { createHashRouter } from 'react-router-dom'
import App from './App'
import Files from './pages/Files/Files'
import History from './pages/History'
import Playlist from './pages/Playlist/Playlist'
import NotFound from './pages/NotFound'
import Setting from './pages/Setting'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Files />,
      },
      {
        path: '/history',
        element: <History />,
      },
      {
        path: '/playlist/:id',
        element: <Playlist />,
      },
      {
        path: '/setting',
        element: <Setting />,
      }
    ]
  },
])

export default router