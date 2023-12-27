import { useEffect } from 'react'
import useUiStore from '../../store/useUiStore'
import useTheme from './useTheme'
const useThemeColor = () => {
  const [audioViewIsShow, videoViewIsShow] = useUiStore((state) => [state.audioViewIsShow, state.videoViewIsShow])
  const theme = useTheme()

  useEffect(
    () => {
      const themeColorLight = document.getElementById('themeColorLight') as HTMLMetaElement
      const themeColorDark = document.getElementById('themeColorDark') as HTMLMetaElement

      if (themeColorLight && themeColorDark) {
        if (audioViewIsShow || videoViewIsShow) {
          themeColorLight.content = '#1e1e1e'
          themeColorDark.content = '#1e1e1e'
        } else {
          themeColorLight.content = theme.palette.background.default
          themeColorDark.content = theme.palette.background.default
        }
      }
    },
    [audioViewIsShow, theme.palette.background.default, videoViewIsShow]
  )
}

export default useThemeColor