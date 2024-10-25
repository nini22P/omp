import { Ref, forwardRef, useMemo } from 'react'
import useFullscreen from '@/hooks/ui/useFullscreen'
import useUiStore from '@/store/useUiStore'
import { animated, useSpring } from '@react-spring/web'

const VideoPlayer = forwardRef(
  ({ url, onEnded }: { url: string; onEnded: () => void }, ref: Ref<HTMLVideoElement> | null) => {

    const videoViewIsShow = useUiStore((state) => state.videoViewIsShow)

    const { handleClickFullscreen } = useFullscreen()

    const [{ top, borderRadius }, api] = useSpring(() => ({
      from: {
        top: videoViewIsShow ? '0' : '100dvh',
        borderRadius: videoViewIsShow ? '0' : '0.5rem',
      },
    }))

    const show = () => api.start({
      to: { top: '0', borderRadius: '0' },
    })

    const hide = () => {
      api.start({
        to: { top: '100dvh' },
      })
    }

    useMemo(
      () => videoViewIsShow ? show() : hide(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [videoViewIsShow]
    )

    return (
      <animated.div
        style={{
          width: '100%',
          height: '100dvh',
          position: 'fixed',
          backgroundColor: 'black',
          top: top,
          borderRadius: borderRadius,
        }}
      >
        <video
          width={'100%'}
          height={'100%'}
          src={url}
          ref={ref}
          onEnded={() => onEnded()}
          onDoubleClick={() => handleClickFullscreen()}
        />
      </animated.div>
    )
  }
)
export default VideoPlayer