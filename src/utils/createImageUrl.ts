import { LibraryDB } from "@/db"
import { Picture } from "@/types/metaData"

const createImageUrl = async (db: LibraryDB | null, image: Picture[]) => {
  if (!db) return './cover.svg'

  if (image && image.length > 0) {
    const picutreData = await db.pictures.get(image[0].sha256)
    if (picutreData) {
      const blob = new Blob([picutreData.data as unknown as ArrayBuffer], { type: image[0].format })
      return URL.createObjectURL(blob)
    } else {
      return './cover.svg'
    }
  }
  return './cover.svg'
}

export default createImageUrl