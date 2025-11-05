import { QueuedTrack } from '@/types/playQueue'

/**
 * 创建随机播放队列，如果传入id时这首歌曲会排到第一
 * @param playQueue 播放队列
 * @param index 想要排第一的歌曲id
 * @returns 
 */
const shufflePlayQueue = (playQueue: QueuedTrack[], index?: number) => {
  const randomPlayQueue = [...playQueue]
  for (let i = randomPlayQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[randomPlayQueue[i], randomPlayQueue[j]] = [randomPlayQueue[j], randomPlayQueue[i]]
  }
  if (index !== undefined)
    return randomPlayQueue.filter(item => item.index === index).concat(randomPlayQueue.filter(item => item.index !== index))
  else return randomPlayQueue
}

export default shufflePlayQueue