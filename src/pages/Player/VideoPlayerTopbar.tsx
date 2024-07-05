import { Box, IconButton, useTheme } from '@mui/material'
import useUiStore from '@/store/useUiStore'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

const VideoPlayerTopbar = () => {

  const theme = useTheme()

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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100dvw',
      height: 'var(--titlebar-height)',
      display: 'flex',
      justifyContent: 'center',
      transform: videoViewIsShow && controlIsShow ? 'none' : 'translateY(calc(-1 * var(--titlebar-height)))',
      transition: 'all 0.2s ease-out',
    }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1536px',
          height: '100%',
        }}
      >
        <div
          style={{
            width: 'fit-content',
            height: '100%',
            display: 'flex',
            background: `${theme.palette.background.paper}99`,
            backdropFilter: 'blur(16px)',
          }}
          className='app-region-no-drag'
        >
          <IconButton
            aria-label="close"
            onClick={() => {
              updateVideoViewIsShow(false)
              updateControlIsShow(true)
            }}
            sx={{
              height: '100%',
              borderRadius: '0.25rem',
              '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                borderRadius: '0.25rem',
              },
              aspectRatio: '1 / 1',
            }}
          >
            <KeyboardArrowDownRoundedIcon />
          </IconButton>
        </div>
      </Box>
    </div>
  )
}

export default VideoPlayerTopbar