import { useCallback, useEffect } from 'react'
import usePlayerControl from './usePlayerControl'
import usePlayerStore from '@/store/usePlayerStore'
import { useShallow } from 'zustand/shallow'

const useMediaSession = (player: HTMLVideoElement | null) => {

  const [
    currentMetaData,
    cover,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.currentMetaData,
        state.cover,
      ]
    )
  )

  const {
    seekTo,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
  } = usePlayerControl(player)

  const defaultSkipTime = 10
  // 更新 MediaSession 播放进度
  const updatePositionState = useCallback(
    () => {
      if ('setPositionState' in navigator.mediaSession && player && !isNaN(player.duration)) {
        console.log('Update MediaSession Position State')
        navigator.mediaSession.setPositionState({
          duration: player.duration,
          playbackRate: player.playbackRate,
          position: player.currentTime,
        })
      }
    },
    [player]
  )

  useEffect(
    () => {
      if (player)
        player.onplaying = () => {
          updatePositionState()
        }
    },
    [player, updatePositionState]
  )

  // 设置 MediaSession
  useEffect(
    () => {
      if ('mediaSession' in navigator && currentMetaData) {
        console.log('Set MediaSession')
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentMetaData?.title,
          artist: currentMetaData?.artist,
          album: currentMetaData?.album,
          artwork: [{ src: cover }]
        })
        navigator.mediaSession.setActionHandler('play', () => handleClickPlay())
        navigator.mediaSession.setActionHandler('pause', () => handleClickPause())
        navigator.mediaSession.setActionHandler('nexttrack', () => handleClickNext())
        navigator.mediaSession.setActionHandler('previoustrack', () => handleClickPrev())
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
          const skipTime = details.seekOffset || defaultSkipTime
          handleClickSeekbackward(skipTime)
        })
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
          const skipTime = details.seekOffset || defaultSkipTime
          handleClickSeekforward(skipTime)
        })
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime) {
            seekTo(details.seekTime)
          }
        })
        return () => {
          navigator.mediaSession.metadata = null
          navigator.mediaSession.setPositionState(undefined)
          navigator.mediaSession.setActionHandler('play', null)
          navigator.mediaSession.setActionHandler('pause', null)
          navigator.mediaSession.setActionHandler('nexttrack', null)
          navigator.mediaSession.setActionHandler('previoustrack', null)
          navigator.mediaSession.setActionHandler('seekbackward', null)
          navigator.mediaSession.setActionHandler('seekforward', null)
          navigator.mediaSession.setActionHandler('seekto', null)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cover, currentMetaData]
  )
}

export default useMediaSession