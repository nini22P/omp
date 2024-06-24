import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { shufflePlayQueue } from '@/utils'
import { useEffect } from 'react'

const usePlayerControl = (player: HTMLVideoElement | null) => {

  const [
    playQueue,
    currentIndex,
    updateCurrentIndex,
    updatePlayQueue,
  ] = usePlayQueueStore(
    (state) => [
      state.playQueue,
      state.currentIndex,
      state.updateCurrentIndex,
      state.updatePlayQueue,
    ]
  )

  const [
    updatePlayStatu,
    updateCurrentTime,
  ] = usePlayerStore(
    (state) => [
      state.updatePlayStatu,
      state.updateCurrentTime,
    ]
  )

  const [
    shuffle,
    repeat,
    volume,
    playbackRate,
    updateShuffle,
    updateRepeat,
  ] = useUiStore(
    (state) => [
      state.shuffle,
      state.repeat,
      state.volume,
      state.playbackRate,
      state.updateShuffle,
      state.updateRepeat,
    ]
  )

  // 播放开始
  const handleClickPlay = () => {
    updatePlayStatu('playing')
  }

  // 播放暂停
  const handleClickPause = () => {
    updatePlayStatu('paused')
  }

  // 下一曲
  const handleClickNext = () => {
    if (player && playQueue) {
      const next = playQueue[(playQueue.findIndex(item => item.index === currentIndex) + 1)]
      // player.pause()
      if (next) {
        updateCurrentIndex(next.index)
      } else
        updateCurrentIndex(playQueue[0].index)
    }
  }

  // 上一曲
  const handleClickPrev = () => {
    if (player && playQueue) {
      const prev = playQueue[(playQueue.findIndex(item => item.index === currentIndex) - 1)]
      // player.pause()
      console.log(prev, playQueue.at(-1))
      if (prev) {
        updateCurrentIndex(prev.index)
      } else
        updateCurrentIndex(playQueue[playQueue.length - 1].index)
    }
  }

  /**
   * 快进
   * @param skipTime 
   */
  const handleClickSeekbackward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.max(player.currentTime - skipTime, 0)
    }
  }

  /**
   * 快退
   * @param skipTime 
   */
  const handleClickSeekforward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.min(player.currentTime + skipTime, player.duration)
    }
  }

  /**
   * 跳到指定位置
   * @param seekTime 
   */
  const seekTo = (seekTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = seekTime
    }
  }

  /**
 * 点击进度条
 * @param current 
 */
  const handleTimeRangeonChange = (current: number | number[]) => {
    if (player && !isNaN(player.duration) && typeof (current) === 'number') {
      updateCurrentTime(player.duration / 1000 * Number(current))
      seekTo(player.duration / 1000 * Number(current))
    }
  }

  // 随机
  useEffect(
    () => {
      if (shuffle && playQueue) {
        const randomPlayQueue = shufflePlayQueue(playQueue, currentIndex)
        updatePlayQueue(randomPlayQueue)
      } else if (!shuffle && playQueue) {
        updatePlayQueue([...playQueue].sort((a, b) => a.index - b.index))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shuffle]
  )

  const handleClickShuffle = () => updateShuffle(!shuffle)

  // 重复
  const handleClickRepeat = () => {
    if (repeat === 'off')
      updateRepeat('all')
    if (repeat === 'all')
      updateRepeat('one')
    if (repeat === 'one')
      updateRepeat('off')
  }

  useEffect(
    () => {
      if (player) {
        player.volume = (isNaN(volume / 100) || volume < 0 || volume > 100) ? 0.8 : (volume / 100)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player && player.src, volume]
  )

  // 播放速度
  useEffect(
    () => {
      if (player) {
        player.playbackRate = playbackRate
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player && player.src, playbackRate]
  )

  return {
    seekTo,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
    handleTimeRangeonChange,
    handleClickShuffle,
    handleClickRepeat,
  }

}

export default usePlayerControl