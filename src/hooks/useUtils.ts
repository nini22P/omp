import useUiStore from '@/store/useUiStore'
import { FileItem } from '@/types/file'

const useUtils = () => {
  const hdThumbnails = useUiStore(state => state.hdThumbnails)

  const findThumbnail = (item: FileItem) => {
    if (item.thumbnails && item.thumbnails[0])
      return hdThumbnails ? item.thumbnails[0].large : item.thumbnails[0].medium
    return null
  }

  return { findThumbnail }
}
export default useUtils