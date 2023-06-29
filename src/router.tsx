import { createHashRouter } from 'react-router-dom'
import App from './App'
import Files from './components/Files/Files'
import History from './components/History'
import Playlist from './components/Playlist/Playlist'
import NotFound from './components/NotFound'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Files />
      },
      {
        path: '/history',
        element: <History />
      },
      {
        path: '/playlist/:id',
        element: <Playlist />
      },
    ]
  },
])

export default router