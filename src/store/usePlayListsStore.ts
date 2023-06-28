import { create } from 'zustand'
import { PlaylistsStatus, PlaylistsAction } from '../type'
import { filePathConvert } from '../util'
const usePlaylistsStore = create<PlaylistsStatus & PlaylistsAction>((set) => ({

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
              files.find((file) =>
                filePathConvert(file.filePath) !== filePathConvert(item.filePath)
              )
            ))
          }
          : playlist
      )
    })),

  removeFilesFromPlaylist: (id, filePathArray) =>
    set((state) => ({
      playlists: state.playlists?.map((playlist) =>
        (playlist.id === id)
          ? {
            ...playlist,
            fileList: playlist.fileList.filter((file) =>
              filePathArray.find((filePath) =>
                filePathConvert(filePath) !== filePathConvert(file.filePath)
              ))
          }
          : playlist
      )
    })),

}))

export default usePlaylistsStore