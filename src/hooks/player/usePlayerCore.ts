import { useState, useMemo, useEffect } from 'react'
import * as mm from 'music-metadata-browser'
import useHistoryStore from '@/store/useHistoryStore'
import useLocalMetaDataStore from '@/store/useLocalMetaDataStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { pathConvert } from '@/utils'
import useFilesData from '../graph/useFilesData'

const usePlayerCore = (player: HTMLVideoElement | null) => {

  const { getFileData } = useFilesData()

  const [
    type,
    playQueue,
    currentIndex,
    updateCurrentIndex,
  ] = usePlayQueueStore(
    (state) => [
      state.type,
      state.playQueue,
      state.currentIndex,
      state.updateCurrentIndex,
    ]
  )

  const { getLocalMetaData, setLocalMetaData } = useLocalMetaDataStore()

  const [
    currentMetaData,
    metadataUpdate,
    playStatu,
    isLoading,
    updateCurrentMetaData,
    updateMetadataUpdate,
    updatePlayStatu,
    updateIsLoading,
    updateCover,
    updateCurrentTime,
    updateDuration,
  ] = usePlayerStore(
    (state) => [
      state.currentMetaData,
      state.metadataUpdate,
      state.playStatu,
      state.isLoading,
      state.updateCurrentMetaData,
      state.updateMetadataUpdate,
      state.updatePlayStatu,
      state.updateIsLoading,
      state.updateCover,
      state.updateCurrentTime,
      state.updateDuration,
    ]
  )

  const [
    repeat,
  ] = useUiStore(
    (state) => [
      state.repeat,
    ]
  )

  const [historyList, insertHistory] = useHistoryStore((state) => [state.historyList, state.insertHistory])

  const [url, setUrl] = useState('')

  // 获取当前播放文件链接
  useMemo(
    () => {
      if (player) {
        player.src = ''
      }
      if (playQueue !== null && playQueue.length !== 0) {
        try {
          getFileData(pathConvert(playQueue.filter(item => item.index === currentIndex)[0].filePath)).then((res) => {
            setUrl(res['@microsoft.graph.downloadUrl'])
            updateIsLoading(true)
          })
        } catch (error) {
          console.error(error)
          updatePlayStatu('paused')
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playQueue?.find(item => item.index === currentIndex)?.filePath]
  )

  useMemo(
    () => {
      if (player !== null && playQueue) {
        updateDuration(0)
        player.load()
        player.onloadedmetadata = () => {
          if (isLoading && playStatu === 'playing') {
            player.play()
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

  // 播放开始暂停
  useEffect(
    () => {
      if (player !== null && !isLoading && player.src.includes('1drv.com')) {
        if (playStatu === 'playing') {
          console.log('Playing', playQueue?.filter(item => item.index === currentIndex)[0].filePath)
          if (playQueue?.filter(item => item.index === currentIndex)[0].filePath) {
            player?.play()
            const currentItem = playQueue.filter(item => item.index === currentIndex)[0]
            if (historyList !== null) {
              insertHistory({
                fileName: currentItem.fileName,
                filePath: currentItem.filePath,
                fileSize: currentItem.fileSize,
                fileType: currentItem.fileType,
              })
            }
          }
          else {
            updatePlayStatu('paused')
          }
        }
        if (playStatu === 'paused')
          player?.pause()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playStatu, isLoading]
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
      const next = playQueue[(playQueue.findIndex(item => item.index === currentIndex) + 1)]
      const isPlayQueueEnd = currentIndex + 1 === playQueue?.length
      if (repeat === 'one') {
        player?.play()
      } else if (repeat === 'off' || repeat === 'all') {
        if (isPlayQueueEnd || !next) {
          if (repeat === 'off')
            updatePlayStatu('paused')
          updateCurrentIndex(playQueue[0].index)
        } else
          updateCurrentIndex(next.index)
      }
    }
  }

  // 更新当前 metadata
  useEffect(
    () => {
      const updateMetaData = async () => {

        if (playQueue) {

          const metaData = await getLocalMetaData(playQueue.filter(item => item.index === currentIndex)[0]?.filePath)

          if (!metaData) {
            const currentMetaData = playQueue.filter(item => item.index === currentIndex)[0]
            updateCover('./cover.svg')
            updateCurrentMetaData(
              {
                title: currentMetaData?.fileName || 'Not playing',
                artist: '',
                path: currentMetaData?.filePath,
              }
            )
          }

          if (
            type === 'audio'
            &&
            metaData
            &&
            metaData.path
            &&
            pathConvert(metaData.path) === pathConvert(playQueue.filter(item => item.index === currentIndex)[0].filePath)
          ) {
            console.log('Update current metaData: ', metaData.title)
            updateCurrentMetaData(metaData)
            if (metaData.cover?.length) {
              const cover = metaData.cover[0].data
              if (cover && 'data' in cover && Array.isArray(cover.data)) {
                updateCover(URL.createObjectURL(new Blob([new Uint8Array(cover.data as unknown as ArrayBufferLike)], { type: 'image/png' })))
              }
              else if (cover) {
                updateCover(URL.createObjectURL(new Blob([new Uint8Array(cover as ArrayBufferLike)], { type: 'image/png' })))
              }
            } else {
              updateCover('./cover.svg')
            }
          }
        }
      }

      updateMetaData()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playQueue?.filter(item => item.index === currentIndex)[0]?.filePath, metadataUpdate]
  )

  // 获取在线 metadata
  useEffect(
    () => {
      const getNetMetaData = async (path: string[]) => {
        console.log('Start get net metadata: ', path.slice(-1)[0])
        try {
          const metadata = await mm.fetchFromUrl(url)
          if (metadata && metadata.common.title !== undefined) {
            const metaData = {
              path: path,
              title: metadata.common.title,
              artist: metadata.common.artist,
              albumArtist: metadata.common.albumartist,
              album: metadata.common.album,
              year: metadata.common.year,
              genre: metadata.common.genre,
              cover: metadata.common.picture,
            }
            return metaData
          }
        } catch (error) {
          console.log('Failed to get net metadata', error)
          return null
        }
      }

      const run = async () => {

        if (playQueue && type === 'audio' && currentMetaData?.path) {
          const localMetaData = await getLocalMetaData(currentMetaData?.path)

          if (!localMetaData) {
            const netMetaData = await getNetMetaData(currentMetaData?.path)
            console.log('Get net metadata: ', netMetaData?.title)
            if (netMetaData) {
              setLocalMetaData(netMetaData).then(() => updateMetadataUpdate())
            }
          }
        }
      }

      run()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

  return {
    url,
    onEnded,
  }

}

export default usePlayerCore