import { Grid, Slider, Typography } from "@mui/material"
import { timeShift } from "../../util"

const PlayerControlSlider = ({ handleTimeRangeOnInput, currentTime, duration }
  : { handleTimeRangeOnInput: (e: any) => void, currentTime: number, duration: number }
) => {
  return (
    <div>
      <Grid container spacing={1} pl={1} pr={1} sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
        <Grid item xs="auto" >
          <Typography
            component="div"
            color="text.secondary"
            sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
          >
            {timeShift(currentTime)}
          </Typography>
        </Grid >
        <Grid item xs>
          <Slider
            size="small"
            min={0}
            max={1000}
            value={(!duration) ? 0 : currentTime / duration * 1000}
            onChange={(e) => handleTimeRangeOnInput(e)}
            sx={{ color: "#222" }}
          />
        </Grid>
        <Grid item xs="auto">
          <Typography
            component="div"
            color="text.secondary"
            sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
          >
            {timeShift((duration) ? duration : 0)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default PlayerControlSlider