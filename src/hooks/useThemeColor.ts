import { useEffect } from 'react'
import useUiStore from '../store/useUiStore'
const useThemeColor = () => {
  const [audioViewIsShow, videoViewIsShow] = useUiStore((state) => [state.audioViewIsShow, state.videoViewIsShow])

  useEffect(() => {
    const themeColorLight = document.getElementById('themeColorLight') as HTMLMetaElement
    const themeColorDark = document.getElementById('themeColorDark') as HTMLMetaElement

    if (themeColorLight && themeColorDark) {
      if (audioViewIsShow || videoViewIsShow) {
        themeColorLight.content = '#1e1e1e'
        themeColorDark.content = '#1e1e1e'
      } else {
        themeColorLight.content = '#ffffff'
        themeColorDark.content = '#121212'
      }
    }
  },
    [audioViewIsShow, videoViewIsShow]
  )
}

export default useThemeColor