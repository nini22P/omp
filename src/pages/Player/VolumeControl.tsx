import { IconButton, Popover, Box, Slider, Tooltip } from '@mui/material'
import { useState } from 'react'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import useUiStore from '@/store/useUiStore'
import { useWheel } from '@use-gesture/react'

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

  const bind = useWheel((state) => {
    const _volume: number = Number((volume - state.movement[1] / 100).toFixed(0))
    updateVolume(Math.min(Math.max(_volume, 0), 100))
  })

  return (
    <div {...bind()}>
      <Tooltip
        title={volume}
        placement='top'
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10],
                },
              },
            ],
          },
        }}
      >
        <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => setVolumeAnchorEl(event.currentTarget)} >
          {
            volume === 0
              ? <VolumeOffIcon />
              : volume < 50
                ? <VolumeDownIcon />
                : <VolumeUpIcon />
          }
        </IconButton>
      </Tooltip>
      <Popover
        open={volumeOpen}
        onClose={() => setVolumeAnchorEl(null)}
        anchorEl={volumeAnchorEl}
        anchorOrigin={{
          vertical: audioViewIsShow ? 'bottom' : 'top',
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
            padding: '1rem 0.75rem 1.75rem 0.75rem',
            gap: '1.5em',
            minHeight: '240px',
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
              flexGrow: 1,
            }}
          />
        </Box>
      </Popover>
    </div>
  )
}