import { Slider, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { timeShift } from "../../util"

const AudioViewSlider = (
  { handleTimeRangeOnInput, currentTime, duration }
    : { handleTimeRangeOnInput: (e: any) => void, currentTime: number, duration: number }
) => {
  return (
    <div>
      <Grid container pl={1} pr={1} >
        <Grid xs={12}>
          <Slider
            size="small"
            min={0}
            max={1000}
            color={'secondary'}
            value={(!duration) ? 0 : currentTime / duration * 1000}
            onChange={(e) => handleTimeRangeOnInput(e)}
          />
        </Grid>
        <Grid xs={6} textAlign={'left'} >
          <Typography color="text.secondary">
            {timeShift(currentTime)}
          </Typography>
        </Grid >
        <Grid xs={6} textAlign={'right'}>
          <Typography color="text.secondary">
            {timeShift((duration) ? duration : 0)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default AudioViewSlider