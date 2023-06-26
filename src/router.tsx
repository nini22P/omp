import { createHashRouter } from 'react-router-dom'
import App from './App'
import FilesView from './components/List/FilesView'
import NotFound from './components/NotFound'
import History from './components/List/History'
import PlayList from './components/List/PlayList'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <FilesView />
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