import { useEffect, useState } from "react"
import { usePlayerStore } from "../../store"
import { Grid, Slider, Typography } from "@mui/material"

const PlayGrogress = ({ player }: { player: HTMLVideoElement }) => {
  const [updatePlaying] = usePlayerStore((state) => [state.updatePlaying])
  const [currentTime, setcurrentTime] = useState(0)

  useEffect(() => {
    player.ontimeupdate = () => {
      setcurrentTime(player.currentTime)
    }
  }, [player])

  /**
   * 点击进度条
   * @param e 
   */
  const handleTimeRangeOnInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target) {
      player.currentTime = player.duration / 1000 * Number(target.value)
      player.play()
      updatePlaying(true)
    }
  }


  /**
   * 将秒转换为分钟
   * @param time 
   * @returns 
   */
  const timeShift = (time: number) => {
    const minute = Number((time / 60).toFixed())
    const second = Number((time % 60).toFixed())
    return `${(minute < 10) ? '0' + minute : minute} : ${(second < 10) ? '0' + second : second}`
  }

  return (
    <div>
      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
        <Grid item xs={2} >
          <Typography component="div" color="text.secondary">
            {timeShift(currentTime)}
          </Typography>
        </Grid >
        <Grid item sm={8} xs={6}>
          <Slider
            min={0} max={1000} value={(!player.duration) ? 0 : player.currentTime / player.duration * 1000}
            onChange={(e) => handleTimeRangeOnInput(e)}
          />
        </Grid>
        <Grid item xs={2}>
          <Typography component="div" color="text.secondary">
            {timeShift((player.duration) ? player.duration : 0)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default PlayGrogress