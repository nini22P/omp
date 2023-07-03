import { File } from './file'

export interface Playlist {
  id: string;
  title: string;
  fileList: File[];
}

export interface PlaylistsStatus {
  playlists: Playlist[] | null;
}

export interface PlaylistsAction {
  updatePlaylists: (playlists: PlaylistsStatus['playlists']) => void;
  insertPlaylist: (playlist: Playlist) => void;
  renamePlaylist: (id: Playlist['id'], title: Playlist['title']) => void;
  removePlaylist: (id: Playlist['id']) => void;
  insertFilesToPlaylist: (id: Playlist['id'], files: File[]) => void;
  removeFilesFromPlaylist: (id: Playlist['id'], filePathArray: File['filePath'][]) => void;
}