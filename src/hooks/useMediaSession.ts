import { useEffect } from 'react'

export const useMediaSession = (
  player: HTMLVideoElement | null,
  cover: string,
  album: string | undefined,
  artist: string | undefined,
  title: string | undefined,
  handleClickPlay: () => void,
  handleClickPause: () => void,
  handleClickNext: () => void,
  handleClickPrev: () => void,
  handleClickSeekforward: (skipTime: number) => void,
  handleClickSeekbackward: (skipTime: number) => void,
) => {
  const defaultSkipTime = 10
  // 向 mediaSession 发送当前播放进度
  function updatePositionState() {
    if ('setPositionState' in navigator.mediaSession && player && !isNaN(player.duration)) {
      navigator.mediaSession.setPositionState({
        duration: player.duration,
        playbackRate: player.playbackRate,
        position: player.currentTime,
      })
    }
  }
  if (!player?.paused)
    updatePositionState()

  // 添加 mediaSession
  useEffect(() => {
    if ('mediaSession' in navigator && player) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        album: album,
        artwork: [{ src: cover }]
      })
      navigator.mediaSession.setActionHandler('play', () => handleClickPlay())
      navigator.mediaSession.setActionHandler('pause', () => handleClickPause())
      navigator.mediaSession.setActionHandler('nexttrack', () => handleClickNext())
      navigator.mediaSession.setActionHandler('previoustrack', () => handleClickPrev())
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || defaultSkipTime
        handleClickSeekbackward(skipTime)
        updatePositionState()
      })
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || defaultSkipTime
        handleClickSeekforward(skipTime)
        updatePositionState()
      })
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime) {
          if (details.fastSeek && 'fastSeek' in player) {
            player.fastSeek(details.seekTime)
            return
          }
          player.currentTime = details.seekTime
        }
        updatePositionState()
      })
      return () => {
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
        navigator.mediaSession.setActionHandler('seekbackward', null)
        navigator.mediaSession.setActionHandler('seekforward', null)
        navigator.mediaSession.setActionHandler('seekto', null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, cover, album, artist, title])
}