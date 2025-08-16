import { useMediaQuery } from '@mui/material'
import { isTauri } from '@tauri-apps/api/core'
import { useEffect } from 'react'

const useEnvironment = () => {

  const isTauri_ = isTauri()
  const isOverlayMode = useMediaQuery('(display-mode: window-controls-overlay)')

  useEffect(() => {
    const root = document.documentElement

    if (isTauri_) {
      root.setAttribute('data-tauri', 'true')
    } else {
      root.removeAttribute('data-tauri')
    }

    if (isOverlayMode) {
      root.setAttribute('data-window-controls-overlay', 'true')
    } else {
      root.removeAttribute('data-window-controls-overlay')
    }

  }, [isTauri_, isOverlayMode])
}

export default useEnvironment