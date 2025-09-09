import { useMediaQuery } from '@mui/material'
import { useEffect } from 'react'

const useEnvironment = () => {

  const isOverlayMode = useMediaQuery('(display-mode: window-controls-overlay)')

  useEffect(() => {
    const root = document.documentElement

    if (isOverlayMode) {
      root.setAttribute('data-window-controls-overlay', 'true')
    } else {
      root.removeAttribute('data-window-controls-overlay')
    }

  }, [isOverlayMode])
}

export default useEnvironment