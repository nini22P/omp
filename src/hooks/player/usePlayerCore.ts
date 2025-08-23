import { useState, useMemo, useEffect } from 'react'
import useHistoryStore from '@/store/useHistoryStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { getNetMetaData, isAudio, remoteItemToTrack } from '@/utils'
import useGraph from '../graph/useGraph'
import useUser from '../graph/useUser'
import { useShallow } from 'zustand/shallow'
import { setTitle } from '@/tauriUtils'
import { useMsal } from '@azure/msal-react'
import useDb from '../useDb'

const usePlayerCore = (player: HTMLVideoElement | null) => {

  const { instance } = useMsal()
  const { account } = useUser()

  const { getFileData } = useGraph(instance, account)
  const db = useDb(account)

  const [
    currentMetaData,
    metadataUpdate,
    autoPlay,
    isLoading,
    updateCurrentMetaData,
    updateMetadataUpdate,
    updateAutoPlay,
    updateIsLoading,
    updateCover,
    updateCurrentTime,
    updateDuration,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.currentMetaData,
        state.metadataUpdate,
        state.autoPlay,
        state.isLoading,
        state.updateCurrentMetaData,
        state.updateMetadataUpdate,
        state.updateAutoPlay,
        state.updateIsLoading,
        state.updateCover,
        state.updateCurrentTime,
        state.updateDuration,
      ]
    )
  )

  const playQueue = usePlayQueueStore.use.playQueue()
  const currentIndex = usePlayQueueStore.use.currentIndex()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()

  const repeat = useUiStore((state) => state.repeat)
  const [historys, insertHistory] = useHistoryStore(
    useShallow((state) => [state.historys, state.insertHistory])
  )

  const [url, setUrl] = useState('')

  const currentTrack = useMemo(() => playQueue?.find(item => item.index === currentIndex), [currentIndex, playQueue])

  // 获取当前播放文件链接
  useMemo(
    () => {
      (async () => {
        if (player) {
          player.src = ''
        }
        if (playQueue !== null && playQueue.length !== 0 && currentTrack && account) {
          updateIsLoading(true)
          try {
            const remoteItem = await getFileData(currentTrack.track.id, currentTrack.track.path)
            if (!remoteItem || !remoteItem['@microsoft.graph.downloadUrl']) {
              throw new Error('No download url')
            }

            if (remoteItem.cTag !== currentTrack.track.cTag) {
              console.log(`File ${currentTrack.track.name} has been updated in the cloud. Updating local entry.`)
              const newTrack = remoteItemToTrack(remoteItem)
              updatePlayQueue(playQueue.map(item => item.index === currentIndex ? { index: currentIndex, track: newTrack } : item))
            }

            setUrl(remoteItem['@microsoft.graph.downloadUrl'])
          } catch (error) {
            console.error(error)
            updateAutoPlay(false)
            updateIsLoading(false)
            player?.pause()
          }
        }
        return true
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTrack?.track.path.join('/'), account]
  )

  useMemo(
    () => {
      if (player !== null && playQueue) {
        updateDuration(0)
        player.load()
        player.onloadedmetadata = () => {
          if (isLoading && autoPlay) {
            player.play()
            if (historys && currentTrack) {
              insertHistory(currentTrack.track)
            }
          }
          updateIsLoading(false)
          updateDuration(player.duration)
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

  // 设置当前播放进度
  useEffect(
    () => {
      if (player)
        player.ontimeupdate = () => {
          updateCurrentTime(player.currentTime)
        }
    },
    [player, updateCurrentTime]
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

  // 更新当前 metadata
  useEffect(
    () => {
      (async () => {
        if (currentTrack?.track.id && db) {
          const metaData = await db.metadata.get(currentTrack.track.id)

          if (!metaData) {
            updateCover('./cover.svg')
            updateCurrentMetaData(
              {
                id: currentTrack.track.id,
                title: currentTrack.track.name || 'Not playing',
                artist: '',
              }
            )
          } else {
            console.log('Update current metaData: ', metaData)
            updateCurrentMetaData(metaData)
            if (metaData.cover && metaData.cover.length > 0) {
              const cover = metaData.cover[0]
              if (cover && 'data' in cover) {
                updateCover(URL.createObjectURL(new Blob([new Uint8Array(cover.data as unknown as ArrayBuffer)], { type: cover.format })))
              }
            } else {
              updateCover('./cover.svg')
            }
          }
        }
      })()
    },
    [metadataUpdate, db, currentTrack, updateCover, updateCurrentMetaData]
  )

  // 获取在线 metadata
  useEffect(
    () => {
      (async () => {
        if (currentTrack && currentTrack.track.id && isAudio(currentTrack.track.name) && db && url) {
          const localMetaData = await db.metadata.get(currentTrack.track.id)
          if (!localMetaData) {
            const netMetaData = await getNetMetaData(currentTrack.track, url)
            if (netMetaData) {
              console.log('Get net metadata: ', netMetaData)
              await db.metadata.put(netMetaData)
              updateMetadataUpdate()
            }
          }
        }
      })()
    },
    [currentTrack, db, updateMetadataUpdate, url]
  )

  useEffect(() => {
    let newTitle = 'OMP'
    if (currentMetaData) {
      newTitle = `${currentMetaData.title}${currentMetaData.artist ? ` - ${currentMetaData.artist}` : ''}`
    }

    document.title = newTitle
    setTitle(newTitle)

    return () => {
      const defaultTitle = 'OMP'
      document.title = defaultTitle
      setTitle(defaultTitle)
    }
  }, [currentMetaData, player?.paused])

  return {
    url,
    onEnded,
  }

}

export default usePlayerCore