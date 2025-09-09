import { useMemo, useEffect } from 'react'
import useHistoryStore from '@/store/useHistoryStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { useShallow } from 'zustand/shallow'
import useMetaData from './useMetaData'
import useUrl from './useUrl'

const usePlayerCore = (player: HTMLVideoElement | null) => {
  const [
    autoPlay,
    updateAutoPlay,
    updateIsLoading,
    updateCurrentTime,
    updateDuration,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.autoPlay,
        state.updateAutoPlay,
        state.updateIsLoading,
        state.updateCurrentTime,
        state.updateDuration,
      ]
    )
  )

  const playQueue = usePlayQueueStore.use.playQueue()
  const currentIndex = usePlayQueueStore.use.currentIndex()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const repeat = useUiStore((state) => state.repeat)
  const [historys, insertHistory] = useHistoryStore(
    useShallow((state) => [state.historys, state.insertHistory])
  )

  const currentTrack = useMemo(() => playQueue?.find(item => item.index === currentIndex), [currentIndex, playQueue])

  const url = useUrl(player)
  useMetaData(url)

  useEffect(() => {
    if (!url || !currentTrack) {
      return
    }
    (async () => {
      if (player !== null) {
        updateDuration(0)
        player.load()
        player.onloadedmetadata = () => {
          if (autoPlay) {
            player.play()
            if (historys && currentTrack) {
              insertHistory(currentTrack.track)
            }
          }
          updateIsLoading(false)
          updateDuration(player.duration)
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // 设置当前播放进度
  useEffect(
    () => {
      if (player)
        player.ontimeupdate = () => {
          updateCurrentTime(player.currentTime)
        }
    },
    [player, updateCurrentTime, updateDuration]
  )

  // 播放结束时
  const onEnded = () => {
    if (playQueue) {
      const next = playQueue[playQueue.findIndex(item => item.index === currentIndex) + 1]
      const isPlayQueueEnd = currentIndex + 1 === playQueue?.length
      if (repeat === 'one') {
        player?.play()
      } else if (repeat === 'off' || repeat === 'all') {
        if (isPlayQueueEnd || !next) {
          if (repeat === 'off') {
            player?.pause()
            updateAutoPlay(false)
          }
          updateCurrentIndex(playQueue[0].index)
        } else
          updateCurrentIndex(next.index)
      }
    }
  }

  return {
    url,
    onEnded,
  }

}

export default usePlayerCore