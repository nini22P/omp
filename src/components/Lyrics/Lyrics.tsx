import { useMemo, useRef } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { t } from '@lingui/macro'

const Lyrics = ({ lyrics, currentTime }: { lyrics: string, currentTime: number }) => {
  const theme = useTheme()
  const lyricsRef = useRef<HTMLDivElement>(null)

  const isMobile = useMediaQuery('(max-height: 600px) or (max-width: 600px)')

  const xs = useMediaQuery(theme.breakpoints.up('xs'))
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))

  const lyricLineHeight = xl ? 44 : lg ? 46 : md ? 48 : sm ? 48 : xs ? 48 : 50

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
      return -1
    }
  }

  const lyricsList: Lyrics = lyrics
    .split(/\r?\n/)
    .map(item => (
      {
        time: timeToSeconds(item.split(']')[0]),
        text: item.split(']')[1],
      }
    ))
    .filter(item => item.time !== -1)

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
    scrollY: currentLyricIndex >= 0 ? currentLyricIndex * lyricLineHeight : 0,
    config: { mass: 2, tension: 300, friction: 25 },
  })

  const isHighlight = (time: number) => lyricsList[currentLyricIndex] && time === lyricsList[currentLyricIndex].time

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
            <span>{t`No lyrics`}</span>
          </div>
          :
          <animated.div
            ref={lyricsRef}
            style={{
              height: '100%',
              transform: scrollY.to(y => `translateY(-${y}px)`),
            }}
          >
            <div style={{ height: '30%' }} />
            {
              lyricsList.map((item) =>
                <div
                  key={item.time + item.text}
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    height: isHighlight(item.time)
                      ? lyricLineHeight * 1.6
                      : lyricLineHeight,
                    paddingLeft: isHighlight(item.time)
                      ? isMobile ? 0 : '1rem'
                      : isMobile ? '1rem' : '2rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: isHighlight(item.time)
                        ? isMobile ? '1.5rem' : '1.5rem'
                        : isMobile ? '1rem' : '1.2rem',
                      color: isHighlight(item.time)
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                      fontWeight: isHighlight(item.time)
                        ? 'bold'
                        : 'normal',
                      transition: 'font-size 0.3s ease-out, color 0.3s ease, font-weight 0.3s ease',
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              )
            }
            <div style={{ height: '100%' }} />
          </animated.div>
      }
    </div>
  )
}

export default Lyrics
