import { useEffect, useState } from "react"

const usePlayer = (player: any) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  useEffect(() => {
    if (player !== null) {
      player.ontimeupdate = () => {
        setCurrentTime(player.currentTime)
      }
      player.onloadedmetadata = () => {
        setDuration(player.duration)
      }
    }
  }, [player])
  return [currentTime, duration]
}

export default usePlayer