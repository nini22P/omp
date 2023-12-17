import { useEffect } from 'react'
import useUiStore from '../../store/useUiStore'

const useControlHide = (type: string, videoViewIsShow: boolean) => {
  const updateControlIsShow = useUiStore((state) => state.updateControlIsShow)
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
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, videoViewIsShow]
  )
}

export default useControlHide