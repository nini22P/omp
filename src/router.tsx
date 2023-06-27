import { createHashRouter } from 'react-router-dom'
import App from './App'
import Files from './components/Files/Files'
import NotFound from './components/NotFound'
import History from './components/History'
import PlayList from './components/PlayList/PlayList'

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
        element: <PlayList />
      },
    ]
  },
])

export default router