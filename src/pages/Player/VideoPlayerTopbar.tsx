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
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: `${theme.palette.background.paper}99`,
        height: 'var(--titlebar-height)',
        transform: videoViewIsShow && controlIsShow ? 'none' : 'translateY(calc(-1 * var(--titlebar-height)))',
        transition: 'all 0.2s ease-out',
        backdropFilter: 'blur(16px)',
      }}
    >
      <IconButton
        aria-label="close"
        onClick={() => {
          updateVideoViewIsShow(false)
          updateControlIsShow(true)
        }}
        className='app-region-no-drag'
        sx={{
          height: 'var(--titlebar-height)',
          borderRadius: '0.2rem',
          '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
            borderRadius: '0.2rem',
          },
        }}
      >
        <KeyboardArrowDownRoundedIcon />
      </IconButton>
    </Box>
  )
}

export default VideoPlayerTopbar