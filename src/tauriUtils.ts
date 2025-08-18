import { isTauri } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const tauriLocalhost = 'https://tauri.localhost/'

export const setTitle = async (title: string) => {
  if (isTauri()) {
    getCurrentWindow().setTitle(title)
  }
}