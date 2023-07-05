import useSWR from 'swr'
import { shallow } from 'zustand/shallow'
import useUiStore from '../../store/useUiStore'
import useFilesData from '../../hooks/useFilesData'
import BreadcrumbNav from './BreadcrumbNav'
import CommonList from '../CommonList/CommonList'
import Loading from '../Loading'
import { checkFileType, filePathConvert } from '../../util'
import { File } from '../../types/file'

const Files = () => {

  const [folderTree] = useUiStore((state) => [state.folderTree], shallow)
  const { getFilesData } = useFilesData()
  const fileListFetcher = (path: string) => getFilesData(path).then(res =>
    res.map((item: { name: string; size: number; folder: { childCount: number, view: { sortBy: string, sortOrder: string, viewType: string } } }) => {
      return {
        fileName: item.name,
        filePath: [...folderTree, item.name],
        fileSize: item.size,
        fileType: (item.folder) ? 'folder' : checkFileType(item.name)
      }
    }
    )
  )
  const { data: fileListData, error: fileListError, isLoading: fileListIsLoading } = useSWR<File[], Error>(filePathConvert(folderTree), fileListFetcher, { revalidateOnFocus: false })
  console.log('Get folder data')

  return (
    <div>
      <BreadcrumbNav />
      {
        (fileListIsLoading || !fileListData || fileListError)
          ? <Loading />
          : <CommonList
            listData={fileListData}
            multiColumn
          />
      }
    </div>
  )
}

export default Files