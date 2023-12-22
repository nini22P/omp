import { pathConvert } from '../utils'
import { PlaylistsStatus, PlaylistsAction } from '../types/playlist'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

const usePlaylistsStore = createWithEqualityFn<PlaylistsStatus & PlaylistsAction>((set) => ({

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
                pathConvert(file.filePath) !== pathConvert(item.filePath)
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
                pathConvert(filePath) !== pathConvert(file.filePath)
              ))
          }
          : playlist
      )
    })),

}), shallow)

export default usePlaylistsStore