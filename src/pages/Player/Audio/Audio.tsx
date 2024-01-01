import { useTheme } from '@mui/material'
import useUiStore from '@/store/useUiStore'
import { useMemo, useRef } from 'react'
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
  ] = useUiStore(
    (state) => [
      state.audioViewIsShow,
      state.audioViewTheme,
      state.updateAudioViewIsShow,
    ]
  )

  const topRef = useRef(0)
  const [{ top, borderRadius }, api] = useSpring(() => ({
    from: {
      top: audioViewIsShow ? '0' : '100dvh',
      borderRadius: audioViewIsShow ? '0' : '0.5rem',
    },
    // config: {
    //   mass: 1,
    //   tension: 190,
    //   friction: 20,
    // }
  }))

  const show = () => api.start({
    to: { top: '0', borderRadius: '0' },
    // config: { clamp: false },
  })

  const hide = () => {
    api.start({
      from: { top: `${topRef.current}` },
      to: { top: '100dvh' },
      // config: { clamp: true },
    })
    topRef.current = 0
  }

  useMemo(
    () => audioViewIsShow ? show() : hide(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audioViewIsShow]
  )

  const bind = useDrag(({ down, movement: [, my], last, event }) => {
    if ('pointerType' in event && event.pointerType !== 'touch') {
      return
    }

    if (last) {
      if (my > 40) {
        updateAudioViewIsShow(false)
      } else {
        topRef.current = 0
        show()
      }
    } else if (down) {
      topRef.current = my
      api.start({ top: my > 0 ? `${my}px` : '0', borderRadius: '0.5rem' })
    }
  })

  return (
    <animated.div
      {...bind()}
      style={{
        width: '100%',
        maxHeight: '100dvh',
        position: 'fixed',
        backgroundColor: theme.palette.background.paper,
        top: top,
        bottom: 0,
        touchAction: 'pan-x',
      }}
    >
      {audioViewTheme === 'classic' && <Classic player={player} styles={{ borderRadius: borderRadius }} />}
      {audioViewTheme === 'modern' && <Modern player={player} styles={{ borderRadius: borderRadius }} />}
    </animated.div>

  )
}

export default Audio