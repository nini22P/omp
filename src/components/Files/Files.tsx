import { checkFileType, filePathConvert } from '../../util'
import useFilesData from '../../hooks/useFilesData'
import useSWR from 'swr'
import CommonList from '../CommonList/CommonList'
import Loading from '../Loading'
import useUiStore from '../../store/useUiStore'
import { shallow } from 'zustand/shallow'
import { FileItem } from '../../type'
import BreadcrumbNav from './BreadcrumbNav'

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
  const { data: fileListData, error: fileListError, isLoading: fileListIsLoading } = useSWR<FileItem[], Error>(filePathConvert(folderTree), fileListFetcher, { revalidateOnFocus: false })
  console.log('Get folder data')

  return (
    <div>
      <BreadcrumbNav />
      {
        (fileListIsLoading || !fileListData || fileListError)
          ? <Loading />
          : <CommonList
            fileList={fileListData}
          />
      }
    </div>
  )
}

export default Files