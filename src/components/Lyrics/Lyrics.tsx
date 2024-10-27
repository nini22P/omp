import { useMemo, useRef } from 'react'
import { useTheme } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'

const Lyrics = ({ lyrics, currentTime }: { lyrics: string, currentTime: number }) => {
  const theme = useTheme()
  const lyricsRef = useRef<HTMLDivElement>(null)

  type Lyrics = {
    time: number,
    text: string,
  }[];

  function timeToSeconds(time: string) {
    const regex = /(\d{2}):(\d{2})\.(\d{2,3})/
    const match = time.match(regex)

    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      let milliseconds = parseInt(match[3], 10)

      if (match[3].length === 2) {
        milliseconds *= 10
      }

      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000
      return totalSeconds
    } else {
      throw new Error('Invalid time format')
    }
  }

  const lyricsList: Lyrics = lyrics
    .split(/\r?\n/)
    .map(item => ({
      time: timeToSeconds(item.split(']')[0]),
      text: item.split(']')[1],
    }))

  const currentLyricIndex = useMemo(
    () => {
      if (currentTime < lyricsList[0].time)
        return -1
      if (currentTime > lyricsList[lyricsList.length - 1].time)
        return lyricsList.length - 1
      return lyricsList.findIndex(item => item.time > currentTime) - 1
    },
    [currentTime, lyricsList]
  )

  const { scrollY } = useSpring({
    scrollY: currentLyricIndex >= 0 ? currentLyricIndex * 45 : 0,
    config: { mass: 2, tension: 300, friction: 25 },
  })

  // useEffect(() => {
  //   if (currentLyricIndex === -1) {
  //     const currentLyricElement = lyricsRef.current?.children[0]
  //     if (currentLyricElement) {
  //       currentLyricElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
  //     }
  //   } else if (currentLyricIndex >= 0) {
  //     const currentLyricElement = lyricsRef.current?.children[currentLyricIndex]
  //     if (currentLyricElement) {
  //       currentLyricElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  //     }
  //   }
  // }, [currentLyricIndex, lyricsList])

  return (
    <div key={'lyrics'} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {
        lyricsList.length === 0
          ?
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span>暂无歌词</span>
          </div>
          :
          <animated.div
            ref={lyricsRef}
            style={{
              width: '100%',
              transform: scrollY.to(y => `translateY(-${y}px)`),
              marginTop: '50%',
              marginBottom: '50%',
            }}
          >
            {
              lyricsList.map((item, index) =>
                <div key={item.time + item.text} style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: index === currentLyricIndex ? '1.5rem' : '1.2rem',
                      padding: '0.5rem',
                      color: index === currentLyricIndex ? theme.palette.primary.main : theme.palette.text.secondary,
                      fontWeight: index === currentLyricIndex ? 'bold' : 'normal',
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              )
            }
          </animated.div>
      }
    </div>
  )
}

export default Lyrics
