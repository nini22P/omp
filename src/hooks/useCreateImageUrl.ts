import { MetaData } from '@/types/metaData'
import createImageUrl from '@/utils/createImageUrl'
import useSWR from 'swr'

const useCreateImageUrl = (metaData: MetaData | null | undefined) => {
  const { data, error, isLoading } = useSWR(
    metaData?.common.picture ? `createImageUrl/${metaData.id}` : null,
    () => createImageUrl(metaData?.common.picture ?? []),
  )

  return error || isLoading ? './cover.svg' : data ?? './cover.svg'
}

export default useCreateImageUrl