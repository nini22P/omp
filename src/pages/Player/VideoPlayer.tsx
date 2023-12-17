import { Ref, forwardRef } from 'react'
import { Container, Grid, IconButton } from '@mui/material'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import useFullscreen from '@/hooks/ui/useFullscreen'
import useUiStore from '@/store/useUiStore'

const VideoPlayer = forwardRef(
  ({ url, onEnded }: { url: string; onEnded: () => void }, ref: Ref<HTMLVideoElement> | null) => {

    const [
      videoViewIsShow,
      controlIsShow,
      updateVideoViewIsShow,
      updateControlIsShow,
    ] = useUiStore(
      (state) => [
        state.videoViewIsShow,
        state.controlIsShow,
        state.updateVideoViewIsShow,
        state.updateControlIsShow,
      ]
    )

    const { handleClickFullscreen } = useFullscreen()

    return (
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'top 0.35s' }}
        style={(videoViewIsShow) ? { top: '0' } : { top: '100vh' }}
      >
        <Grid container
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'start',
            backgroundColor: '#000'
          }}
        >
          <Grid sx={{ width: '100%', height: '100%' }}>
            <video
              width={'100%'}
              height={'100%'}
              src={url}
              // autoPlay
              ref={ref}
              onEnded={() => onEnded()}
              onDoubleClick={() => handleClickFullscreen()} />
          </Grid>

          {/* 视频播放顶栏 */}
          <Grid
            position={'absolute'}
            sx={controlIsShow ? { top: 16, left: 16, borderRadius: '0 0 5px 0', width: 'auto' } : { display: 'none' }}
            className='pt-titlebar-area-height'
          >
            <IconButton
              aria-label="close"
              onClick={() => {
                updateVideoViewIsShow(false)
                updateControlIsShow(true)
              }}
              className='app-region-no-drag'
            >
              <KeyboardArrowDownOutlinedIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Grid>

        </Grid>

      </Container>
    )
  }
)

export default VideoPlayer