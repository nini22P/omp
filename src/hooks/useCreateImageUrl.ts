import { LibraryDB } from '@/db'
import { MetaData } from '@/types/metaData'
import createImageUrl from '@/utils/createImageUrl'
import useSWRImmutable from 'swr'

const useCreateImageUrl = (db: LibraryDB | null, metaData: MetaData | null | undefined) => {
  const sha256 = metaData?.common.picture?.[0]?.sha256

  const { data, error, isLoading } = useSWRImmutable(
    sha256 ? `createImageUrl/${sha256}` : null,
    async () => createImageUrl(db, metaData?.common.picture ?? []),
  )

  return error || isLoading ? './cover.svg' : data ?? './cover.svg'
}

export default useCreateImageUrl