import { MetaData } from '@/types/metaData'
import { createCoverUrl } from '@/utils'
import useSWR from 'swr'

const useCreateCoverUrl = (metaData: MetaData | null) => {
  const { data, error, isLoading } = useSWR(
    metaData?.cover ? `createCoverUrl/${metaData.id}` : null,
    () => createCoverUrl(metaData?.cover ?? []),
  )

  return error || isLoading ? './cover.svg' : data
}

export default useCreateCoverUrl