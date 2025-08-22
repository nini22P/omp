import { useState, useMemo, useEffect } from 'react'
import useHistoryStore from '@/store/useHistoryStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { getNetMetaData, isAudio } from '@/utils'
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


  const repeat = useUiStore((state) => state.repeat)
  const [historys, insertHistory] = useHistoryStore(
    useShallow((state) => [state.historys, state.insertHistory])
  )

  const [url, setUrl] = useState('')

  const currentFile = useMemo(() => playQueue?.find(item => item.index === currentIndex), [currentIndex, playQueue])

  // 获取当前播放文件链接
  useMemo(
    () => {
      (async () => {
        if (player) {
          player.src = ''
        }
        if (playQueue !== null && playQueue.length !== 0 && currentFile && account) {
          updateIsLoading(true)
          try {
            const res = await getFileData(currentFile.id, currentFile.path)
            if (!res['@microsoft.graph.downloadUrl']) {
              throw new Error('No download url')
            }
            setUrl(res['@microsoft.graph.downloadUrl'])
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
    [currentFile, account]
  )

  useMemo(
    () => {
      if (player !== null && playQueue) {
        updateDuration(0)
        player.load()
        player.onloadedmetadata = () => {
          if (isLoading && autoPlay) {
            player.play()
            if (historys && currentFile) {
              insertHistory(currentFile)
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
        if (currentFile?.id && db) {
          const metaData = await db.metadata.get(currentFile.id)

          if (!metaData) {
            updateCover('./cover.svg')
            updateCurrentMetaData(
              {
                id: currentFile.id,
                title: currentFile.name || 'Not playing',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadataUpdate, db, currentFile?.id]
  )

  // 获取在线 metadata
  useEffect(
    () => {
      (async () => {
        if (currentFile && currentFile.id && isAudio(currentFile.name) && db && url) {
          const localMetaData = await db.metadata.get(currentFile.id)
          if (!localMetaData) {
            const netMetaData = await getNetMetaData(currentFile, url)
            if (netMetaData) {
              console.log('Get net metadata: ', netMetaData)
              await db.metadata.put(netMetaData)
              updateMetadataUpdate()
            }
          }
        }
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
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