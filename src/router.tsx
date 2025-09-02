import { createHashRouter, Navigate, Outlet } from 'react-router-dom'
import App from './App'
import Files from './pages/Files/Files'
import History from './pages/History'
import Playlist from './pages/Playlist/Playlist'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings/Settings'
import Refresh from './pages/Refresh'
import Library from './pages/Library/Library'
import AlbumView from './pages/Library/AlbumView'
import ArtistView from './pages/Library/ArtistView'
import SongView from './pages/Library/SongView'
import FolderView from './pages/Library/FolderView'
import FolderDetail from './pages/Library/FolderDetail'
import AlbumDetail from './pages/Library/AlbumDetail'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="library" replace />
      },
      {
        path: 'library',
        element: <Library />,
        children: [
          {
            index: true,
            element: <Navigate to="albums" replace />
          },
          {
            path: 'albums',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <AlbumView />
              },
              {
                path: ':artist/:album',
                element: <AlbumDetail />
              }
            ]
          },
          {
            path: 'artists',
            element: <ArtistView />
          },
          {
            path: 'songs',
            element: <SongView />
          },
          {
            path: 'folders',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <FolderView />
              },
              {
                path: ':id',
                element: <FolderDetail />
              }
            ]
          }
        ]
      },
      {
        path: 'files/*',
        element: <Files />
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'playlist/:id',
        element: <Playlist />,
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'refresh',
        element: <Refresh />
      },
    ]
  },
])

export default router