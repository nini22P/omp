import { useEffect } from 'react'
import useUiStore from '../../store/useUiStore'
import useTheme from './useTheme'
const useThemeColor = () => {

  const [
    audioViewIsShow,
    audioViewTheme,
    videoViewIsShow,
    color,
  ] = useUiStore(
    (state) => [
      state.audioViewIsShow,
      state.audioViewTheme,
      state.videoViewIsShow,
      state.color,
    ]
  )

  const theme = useTheme()

  useEffect(
    () => {
      const themeColorLight = document.getElementById('themeColorLight') as HTMLMetaElement
      const themeColorDark = document.getElementById('themeColorDark') as HTMLMetaElement

      if (themeColorLight && themeColorDark) {
        if (!audioViewIsShow && !videoViewIsShow) {
          themeColorLight.content = theme.palette.background.default
          themeColorDark.content = theme.palette.background.default
        }
        else if (audioViewIsShow && audioViewTheme === 'classic' || videoViewIsShow) {
          themeColorLight.content = '#1e1e1e'
          themeColorDark.content = '#1e1e1e'
        }
        else if (audioViewIsShow && audioViewTheme === 'modern') {
          themeColorLight.content = color
          themeColorDark.content = color
        }
      }
    },
    [audioViewIsShow, audioViewTheme, color, theme.palette.background.default, videoViewIsShow]
  )

}

export default useThemeColor