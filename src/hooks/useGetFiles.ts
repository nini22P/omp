import { useMsal } from '@azure/msal-react'
import useUser from '@/hooks/graph/useUser'
import useGraph from '@/hooks/graph/useGraph'
import useSWR from 'swr'
import { remoteItemToFileNode } from '@/utils'

const useGetFiles = (folderTree: string[]) => {
  const { instance } = useMsal()
  const { account } = useUser()

  const { getFilesData } = useGraph(instance, account)

  const filesFetcher = async (folderTree: string[]) => {
    const { value } = await getFilesData('', folderTree)
    return value.map(item => remoteItemToFileNode(item, { includeVisuals: true }))
  }

  return useSWR(
    account ? `${account.username}/${folderTree.join('/')}` : null,
    () => filesFetcher(folderTree),
    { revalidateOnFocus: false },
  )
}

export default useGetFiles