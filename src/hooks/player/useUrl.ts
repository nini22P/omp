import usePlayerStore from '@/store/usePlayerStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import { remoteItemToTrack } from '@/utils/track'
import { useMsal } from '@azure/msal-react'
import { useEffect, useMemo, useState } from 'react'
import useGraph from '../graph/useGraph'
import useUser from '../graph/useUser'

const useUrl = (player: HTMLVideoElement | null) => {
  const { instance } = useMsal()
  const { account } = useUser()

  const { getFileData } = useGraph(instance, account)

  const updateAutoPlay = usePlayerStore.use.updateAutoPlay()
  const updateIsLoading = usePlayerStore.use.updateIsLoading()

  const playQueue = usePlayQueueStore.use.playQueue()
  const currentIndex = usePlayQueueStore.use.currentIndex()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()

  const [url, setUrl] = useState('')

  const currentTrack = useMemo(() => playQueue?.find(item => item.index === currentIndex), [currentIndex, playQueue])
  const currentTrackPath = useMemo(() => currentTrack?.track.path?.join('/'), [currentTrack])

  // 获取当前播放文件链接
  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      if (!currentTrack || !account) {
        return
      }

      if (player) {
        player.src = ''
      }

      updateIsLoading(true)

      try {
        const remoteItem = await getFileData(
          currentTrack.track.id,
          currentTrack.track.path,
          controller.signal
        )

        if (!remoteItem || !remoteItem['@microsoft.graph.downloadUrl']) {
          throw new Error('No download url')
        }

        if (remoteItem.cTag !== currentTrack.track.cTag) {
          console.log(`File ${currentTrack.track.name} has been updated. Updating local entry.`)
          const newTrack = remoteItemToTrack(remoteItem)
          updatePlayQueue(playQueue.map(item => item.index === currentIndex ? { index: currentIndex, track: newTrack } : item))
        }

        setUrl(remoteItem['@microsoft.graph.downloadUrl'])

      } catch (error) {
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') {
          console.log('Fetch aborted for previous track.')
        } else {
          console.error(error)
          updateAutoPlay(false)
          player?.pause()
        }
      } finally {
        // if (!controller.signal.aborted) {
        //   updateIsLoading(false)
        // }
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackPath, account])

  return url
}

export default useUrl