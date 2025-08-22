import { PlaylistsActions, PlaylistsState } from '../types/playlist'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const initialState: PlaylistsState = {
  playlists: [],
}

const usePlaylistsStoreBase = create<PlaylistsState & PlaylistsActions>(
  (set) => ({
    ...initialState,
    updatePlaylists: (playlists) => set(() => ({ playlists: playlists })),
    insertPlaylist: (playlist) =>
      set((state) => ({ playlists: (state.playlists) ? [playlist, ...state.playlists] : [playlist] })),
    renamePlaylist: (id, name) =>
      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          (playlist.id === id) ? { ...playlist, name } : playlist)
      })),
    removePlaylist: (id) => set((state) =>
      ({ playlists: state.playlists.filter(playlist => playlist.id !== id) })),
    insertFilesToPlaylist: (id, files) =>
      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          (playlist.id === id)
            ? {
              ...playlist,
              files: files.concat(playlist.files.filter((item) =>
                !files.map(item => item.path).includes(item.path)
              ))
            }
            : playlist
        )
      })),
    removeFilesFromPlaylist: (id, indexArray) =>
      set((state) => ({
        playlists: state.playlists?.map((playlist) =>
          (playlist.id === id)
            ? {
              ...playlist,
              files: playlist.files.filter((_file, index) => !indexArray.includes(index))
            }
            : playlist
        )
      })),
  })
)

const usePlaylistsStore = createSelectors(usePlaylistsStoreBase)

export default usePlaylistsStore