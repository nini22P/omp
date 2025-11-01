import usePlayQueueStore from '@/store/usePlayQueueStore'
import { isAudio } from '@/utils/checkFileType'
import getNetMetaData from '@/utils/getNetMetaData'
import { useEffect, useMemo } from 'react'
import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import usePlayerStore from '@/store/usePlayerStore'
import { useShallow } from 'zustand/shallow'
import createImageUrl from '@/utils/createImageUrl'

const useMetaData = (url: string) => {
  const { account } = useUser()

  const db = useDb(account)

  const [
    metadataUpdate,
    updateCurrentMetaData,
    updateMetadataUpdate,
    updateCover,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.metadataUpdate,
        state.updateCurrentMetaData,
        state.updateMetadataUpdate,
        state.updateCover,
      ]
    )
  )

  const playQueue = usePlayQueueStore.use.playQueue()
  const currentIndex = usePlayQueueStore.use.currentIndex()

  const currentTrack = useMemo(() => playQueue?.find(item => item.index === currentIndex), [currentIndex, playQueue])

  // 更新当前 metadata
  useEffect(
    () => {
      (async () => {
        if (currentTrack?.track.id && db) {
          const metaData = await db.metadata.get(currentTrack.track.id)

          if (!metaData) {
            updateCover('./cover.svg')
            updateCurrentMetaData(null)
          } else {
            console.log('Update current metaData: ', metaData)
            updateCurrentMetaData(metaData)
            if (metaData.common.picture && metaData.common.picture.length > 0) {
              const cover = metaData.common.picture[0]
              if (cover && 'sha256' in cover) {
                const coverUrl = await createImageUrl(db, metaData.common.picture)
                updateCover(coverUrl)
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
            console.log('Start get net metadata: ', currentTrack.track)
            const result = await getNetMetaData(currentTrack.track, url)
            if (result) {
              await db.metadata.put(result.metaData)
              await db.pictures.bulkPut(result.pictureData)
              updateMetadataUpdate()
            }
          }
        }
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

}

export default useMetaData