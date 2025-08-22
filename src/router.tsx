import { createHashRouter } from 'react-router-dom'
import App from './App'
import Files from './pages/Files/Files'
import History from './pages/History'
import Playlist from './pages/Playlist/Playlist'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings/Settings'
import Refresh from './pages/Refresh'
import Library from './pages/Library/Library'

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
        path: '/library',
        element: <Library />
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
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/refresh',
        element: <Refresh />
      },
    ]
  },
])

export default router