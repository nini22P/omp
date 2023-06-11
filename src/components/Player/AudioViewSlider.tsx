import { Slider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { timeShift } from '../../util'

const AudioViewSlider = (
  { handleTimeRangeOnInput, currentTime, duration }
    : { handleTimeRangeOnInput: (e: any) => void, currentTime: number, duration: number }
) => {
  return (
    <div>
      <Grid container pl={1} pr={1}>
        <Grid xs={12}
          p={0}
        >
          <Slider
            size="small"
            min={0}
            max={1000}
            value={(!duration) ? 0 : currentTime / duration * 1000}
            onChange={(e) => handleTimeRangeOnInput(e)}
            style={{ color: '#fff' }}
          />
        </Grid>
        <Grid xs={6} textAlign={'left'}>
          <Typography style={{ color: '#fff' }} >
            {timeShift(currentTime)}
          </Typography>
        </Grid >
        <Grid xs={6} textAlign={'right'}>
          <Typography style={{ color: '#fff' }} >
            {timeShift((duration) ? duration : 0)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default AudioViewSlider