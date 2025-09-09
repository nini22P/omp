
import usePlayerStore from '@/store/usePlayerStore'
import { useEffect } from 'react'

const useTitle = () => {

  const currentMetaData = usePlayerStore.use.currentMetaData()

  useEffect(() => {
    let newTitle = 'OMP'
    if (currentMetaData) {
      newTitle = `${currentMetaData.common.title}${currentMetaData.common.artist ? ` - ${currentMetaData.common.artist}` : ''}`
    }

    document.title = newTitle

    return () => {
      const defaultTitle = 'OMP'
      document.title = defaultTitle
    }
  }, [currentMetaData])

}

export default useTitle