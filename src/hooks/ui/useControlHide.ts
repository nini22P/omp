import { useEffect } from 'react'
import useUiStore from '../../store/useUiStore'

const useControlHide = (type: string) => {
  const [videoViewIsShow, updateControlIsShow] = useUiStore((state) => [state.videoViewIsShow, state.updateControlIsShow])
  useEffect(
    () => {
      if (type === 'video' && videoViewIsShow) {
        let timer: string | number | NodeJS.Timeout | undefined
        const resetTimer = () => {
          updateControlIsShow(true)
          clearTimeout(timer)
          timer = (setTimeout(() => updateControlIsShow(false), 5000))
        }
        resetTimer()
        window.addEventListener('mousemove', resetTimer)
        window.addEventListener('mousedown', resetTimer)
        window.addEventListener('keydown', resetTimer)
        return () => {
          window.removeEventListener('mousemove', resetTimer)
          window.removeEventListener('mousedown', resetTimer)
          window.removeEventListener('keydown', resetTimer)
          clearTimeout(timer)
        }
      } else {
        updateControlIsShow(true)
      }
    },
    [type, updateControlIsShow, videoViewIsShow]
  )
}

export default useControlHide