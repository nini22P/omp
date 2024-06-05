import { IconButton, Popover, Box, Slider } from '@mui/material'
import { useState } from 'react'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import useUiStore from '@/store/useUiStore'

export default function VolumeControl() {

  const [
    audioViewIsShow,
    volume,
    updateVolume,
  ] = useUiStore(
    (state) => [
      state.audioViewIsShow,
      state.volume,
      state.updateVolume,
    ]
  )

  const [volumeAnchorEl, setVolumeAnchorEl] = useState<HTMLElement | null>(null)
  const volumeOpen = Boolean(volumeAnchorEl)

  return (
    <div>
      <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => setVolumeAnchorEl(event.currentTarget)} >
        {
          volume === 0
            ? <VolumeOffIcon />
            : volume < 50
              ? <VolumeDownIcon/>
              : <VolumeUpIcon />
        }
      </IconButton>
      <Popover
        open={volumeOpen}
        onClose={() => setVolumeAnchorEl(null)}
        anchorEl={volumeAnchorEl}
        anchorOrigin={{
          vertical: audioViewIsShow ? 'bottom': 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: audioViewIsShow ? 'top' : 'bottom',
          horizontal: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem 0.5rem 1rem 0.5rem',
            gap: '1em',
          }}
        >
          {volume}
          <Slider
            aria-label="Volume"
            orientation="vertical"
            value={volume}
            min={0}
            max={100}
            onChange={(_, value) => updateVolume(value as number)}
            sx={{
              minHeight: '160px',
            }}
          />
        </Box>
      </Popover>
    </div>
  )
}