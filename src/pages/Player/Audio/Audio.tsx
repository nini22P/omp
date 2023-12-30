import { useTheme } from '@mui/material'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { useMemo, useRef } from 'react'
import { extractColors } from 'extract-colors'
import Classic from './Classic'
import Modern from './Modern'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

const Audio = ({ player }: { player: HTMLVideoElement | null }) => {

  const theme = useTheme()

  const [
    audioViewIsShow,
    audioViewTheme,
    updateAudioViewIsShow,
    updateColor,
  ] = useUiStore(
    (state) => [
      state.audioViewIsShow,
      state.audioViewTheme,
      state.updateAudioViewIsShow,
      state.updateColor,
    ]
  )

  const [cover] = usePlayerStore((state) => [state.cover])

  // 从专辑封面提取颜色
  useMemo(
    () => (cover !== './cover.webp') &&
      extractColors(cover).then(color => updateColor(color[0].hex)).catch(console.error),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cover]
  )

  const immediateRef = useRef(false)
  const [{ top }, api] = useSpring(() => ({ top: audioViewIsShow ? '0' : '100dvh' }))
  const show = () => api.start({ top: '0' })
  const hide = () => api.start({ top: '100dvh', immediate: immediateRef.current })

  useMemo(
    () => audioViewIsShow ? show() : hide(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audioViewIsShow]
  )

  const bind = useDrag(({ down, movement: [, my], last }) => {
    if (last) {
      if (my > window.innerHeight * 0.5) {
        updateAudioViewIsShow(false)
      } else {
        immediateRef.current = false
        show()
      }
    } else if (down) {
      immediateRef.current = true
      api.start({ top: my > 0 ? `${my}px` : '0' })
    }
  })

  return (
    <animated.div
      {...bind()}
      style={{
        width: '100%',
        height: '100dvh',
        position: 'fixed',
        backgroundColor: theme.palette.background.paper,
        top: top,
        touchAction: 'pan-x',
      }}
    >
      {audioViewTheme === 'classic' && <Classic player={player} />}
      {audioViewTheme === 'modern' && <Modern player={player} />}
    </animated.div>

  )
}

export default Audio