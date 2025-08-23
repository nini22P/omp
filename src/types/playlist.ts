import { FileItem, Track } from './file'

export interface OldPlaylist {
  id: string
  title: string
  fileList: FileItem[]
}

export interface Playlist {
  id: string
  name: string
  files: Track[]
}

export interface PlaylistsState {
  playlists: Playlist[] | null
}

export interface PlaylistsActions {
  updatePlaylists: (playlists: PlaylistsState['playlists']) => void
  insertPlaylist: (playlist: Playlist) => void
  renamePlaylist: (id: Playlist['id'], name: Playlist['name']) => void
  removePlaylist: (id: Playlist['id']) => void
  insertFilesToPlaylist: (id: Playlist['id'], files: Playlist['files']) => void
  removeFilesFromPlaylist: (id: Playlist['id'], indexArray: number[]) => void
}