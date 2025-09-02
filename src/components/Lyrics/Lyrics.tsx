import { useMemo, useRef, useState, useLayoutEffect } from 'react'
import { useTheme } from '@mui/material'
import { ILyricsTag } from 'music-metadata'
import { useSpring, animated } from '@react-spring/web'

interface ProcessedLyricsText {
  timestamp: number
  text: string
  translation: string[]
}

const Lyrics = ({ lyrics, currentTimestamp }: { lyrics: ILyricsTag[], currentTimestamp: number }) => {
  const theme = useTheme()

  const viewPortRef = useRef<HTMLDivElement>(null)
  const lyricRefs = useRef<(HTMLDivElement | null)[]>([])

  const [lyricOffsets, setLyricOffsets] = useState<number[]>([])

  const processedLyrics: ProcessedLyricsText[] = useMemo(() => {
    if (!lyrics || lyrics.length === 0 || !lyrics[0].syncText) return []
    const lyricsMap = new Map<number, ProcessedLyricsText>()
    const result: ProcessedLyricsText[] = []
    const sourceSyncText = lyrics[0].syncText.filter(item => typeof item.timestamp === 'number')
    for (const line of sourceSyncText) {
      const timestamp = line.timestamp as number
      if (!lyricsMap.has(timestamp)) {
        const newLyric = { timestamp, text: line.text, translation: [] }
        lyricsMap.set(timestamp, newLyric)
        result.push(newLyric)
      } else {
        lyricsMap.get(timestamp)!.translation.push(line.text)
      }
    }
    return result
  }, [lyrics])

  useLayoutEffect(() => {
    if (processedLyrics.length > 0) {
      const viewPort = viewPortRef.current
      if (!viewPort) return

      const offsets = lyricRefs.current.map(el => {
        if (!el) return 0
        return el.offsetTop - viewPort.clientHeight / 3 + el.clientHeight / 2
      })

      setLyricOffsets(offsets)
    }
  }, [processedLyrics])

  const currentLyricIndex = useMemo(() => {
    if (processedLyrics.length === 0 || currentTimestamp < processedLyrics[0].timestamp) return -1
    if (currentTimestamp > processedLyrics[processedLyrics.length - 1].timestamp) return processedLyrics.length - 1
    return processedLyrics.findIndex(item => item.timestamp > currentTimestamp) - 1
  }, [currentTimestamp, processedLyrics])

  const { scrollY } = useSpring({
    scrollY: lyricOffsets[currentLyricIndex] ?? 0,
    config: { mass: 2, tension: 300, friction: 25 },
  })

  const isHighlight = (timestamp: number) => {
    return processedLyrics[currentLyricIndex] && timestamp === processedLyrics[currentLyricIndex].timestamp
  }

  return (
    <div
      ref={viewPortRef}
      style={{ height: '100%', width: '100%', overflow: 'hidden' }}
    >
      <animated.div
        style={{
          paddingTop: '45vh',
          paddingBottom: '45vh',
          transform: scrollY.to(y => `translateY(-${y}px)`),
        }}
      >
        {processedLyrics.map((item, index) => (
          <div
            ref={el => (lyricRefs.current[index] = el)}
            key={`${item.timestamp}-${index}`}
            style={{
              padding: '1rem 2rem',
            }}
          >
            <div
              style={{
                transform: isHighlight(item.timestamp) ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.4s ease-out',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: isHighlight(item.timestamp) ? '1.7rem' : '1.2rem',
                  color: isHighlight(item.timestamp) ? theme.palette.text.primary : theme.palette.text.secondary,
                  fontWeight: isHighlight(item.timestamp) ? 'bold' : 'normal',
                  transition: 'all 0.4s ease-out',
                  lineHeight: 1.6,
                }}>
                {item.text}
              </p>
              {item.translation.map((translatedText, tIndex) => (
                <p
                  key={tIndex}
                  style={{
                    margin: 0,
                    marginTop: '0.25rem',
                    fontSize: isHighlight(item.timestamp) ? '1.1rem' : '0.9rem',
                    color: isHighlight(item.timestamp) ? theme.palette.text.secondary : theme.palette.text.disabled,
                    transition: 'all 0.4s ease-out',
                    lineHeight: 1.5
                  }}>
                  {translatedText}
                </p>
              ))}
            </div>
          </div>
        ))}
      </animated.div>
    </div>
  )
}

export default Lyrics