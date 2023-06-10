import { Slider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { timeShift } from '../../util'

const PlayerControlSlider = ({ handleTimeRangeOnInput, currentTime, duration }
  : { handleTimeRangeOnInput: (e: Event) => void, currentTime: number, duration: number }
) => {
  return (
    <div>
      <Grid container
        pl={{ xs: 0, sm: 1 }}
        pr={{ xs: 0, sm: 1 }}
        sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
        <Grid xs='auto' >
          <Typography
            component='div'
            color='text.secondary'
            sx={{ display: { sm: 'inline-grid', xs: 'none' } }}
          >
            {timeShift(currentTime)}
          </Typography>
        </Grid >
        <Grid xs
          pl={{ xs: 1, sm: 2 }}
          pr={{ xs: 1, sm: 2 }}
        >
          <Slider
            size='small'
            min={0}
            max={1000}
            value={(!duration) ? 0 : currentTime / duration * 1000}
            onChange={(e) => handleTimeRangeOnInput(e)}
            sx={{ color: '#222' }}
          />
        </Grid>
        <Grid xs='auto'>
          <Typography
            component='div'
            color='text.secondary'
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