import useUiStore from '@/store/useUiStore'
import { useEffect } from 'react'

const useFullscreen = () => {

  const updateFullscreen = useUiStore(state => state.updateFullscreen)

  // 检测全屏
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  })

  const handleClickFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return { handleClickFullscreen }
}

export default useFullscreen