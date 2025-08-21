import { pathConv } from '../utils'
import { PlaylistsActions, PlaylistsState } from '../types/playlist'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const usePlaylistsStoreBase = create<PlaylistsState & PlaylistsActions>(
  (set) => ({
    playlists: null,
    updatePlaylists: (playlists) => set(() => ({ playlists: playlists })),
    insertPlaylist: (playlist) =>
      set((state) => ({ playlists: (state.playlists) ? [playlist, ...state.playlists] : [playlist] })),
    renamePlaylist: (id, title) =>
      set((state) => ({
        playlists: state.playlists?.map((playlist) =>
          (playlist.id === id) ? { ...playlist, title: title } : playlist)
      })),
    removePlaylist: (id) => set((state) =>
      ({ playlists: state.playlists?.filter(playlist => playlist.id !== id) })),
    insertFilesToPlaylist: (id, files) =>
      set((state) => ({
        playlists: state.playlists?.map((playlist) =>
          (playlist.id === id)
            ? {
              ...playlist,
              fileList: files.concat(playlist.fileList.filter((item) =>
                !files.map(item => pathConv(item.filePath)).includes(pathConv(item.filePath))
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
              fileList: playlist.fileList.filter((_file, index) => !indexArray.includes(index))
            }
            : playlist
        )
      })),
  })
)

const usePlaylistsStore = createSelectors(usePlaylistsStoreBase)

export default usePlaylistsStore