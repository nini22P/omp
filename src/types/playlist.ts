import { FileItem } from './file'

export interface Playlist {
  id: string,
  title: string,
  fileList: FileItem[],
}

export interface PlaylistsStatus {
  playlists: Playlist[] | null,
}

export interface PlaylistsAction {
  updatePlaylists: (playlists: PlaylistsStatus['playlists']) => void,
  insertPlaylist: (playlist: Playlist) => void,
  renamePlaylist: (id: Playlist['id'], title: Playlist['title']) => void,
  removePlaylist: (id: Playlist['id']) => void,
  insertFilesToPlaylist: (id: Playlist['id'], files: FileItem[]) => void,
  removeFilesFromPlaylist: (id: Playlist['id'], indexArray: number[]) => void,
}