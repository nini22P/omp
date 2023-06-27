import { Breadcrumbs, Button } from '@mui/material'
import { checkFileType, filePathConvert } from '../../util'
import useFilesData from '../../hooks/useFilesData'
import useSWR from 'swr'
import FileList from './FileList'
import Loading from '../Loading'
import useUiStore from '../../store/useUiStore'
import { shallow } from 'zustand/shallow'
import { FileItem } from '../../type'

const FilesView = () => {

  const [folderTree, updateFolderTree] = useUiStore((state) => [state.folderTree, state.updateFolderTree], shallow)
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
  /**
   * 点击文件夹导航
   * @param index
   */
  const handleListNavClick = (index: number) => {
    updateFolderTree(folderTree.slice(0, index + 1))
  }

  console.log('Get folder data')

  return (
    <div>
      <Breadcrumbs separator="›" sx={{ m: '0.5rem' }}>
        {
          folderTree.map(
            (name: string, index: number) =>
              <Button key={index} color="inherit" onClick={() => handleListNavClick(index)} >
                {name}
              </Button>
          )
        }
      </Breadcrumbs>
      {(fileListIsLoading || !fileListData || fileListError)
        ? <Loading />
        : <FileList
          fileList={fileListData}
        />
      }
    </div>
  )
}

export default FilesView