import { MetaData } from '@/types/metaData'
import { createImageUrl } from '@/utils'
import useSWR from 'swr'

const useCreateImageUrl = (metaData: MetaData | null) => {
  const { data, error, isLoading } = useSWR(
    metaData?.common.picture ? `createImageUrl/${metaData.id}` : null,
    () => createImageUrl(metaData?.common.picture ?? []),
  )

  return error || isLoading ? './cover.svg' : data
}

export default useCreateImageUrl