import { Breadcrumbs, Button, CircularProgress } from '@mui/material'
import { checkFileType } from '../../util'
import { useState } from 'react'
import useFilesData from '../../hooks/useFilesData'
import useSWR from 'swr'
import FileList from './FileList'

const FilesView = () => {

  const [folderTree, setFolderTree] = useState(['HOME'])
  const { getFilesData } = useFilesData()

  const fileListFetcher = (path: string) => getFilesData(path).then(res =>
    res.map((item: { name: string; size: number; folder: { childCount: number, view: { sortBy: string, sortOrder: string, viewType: string } } }) => {
      return {
        fileName: item.name,
        filePath: (folderTree.join('/') === 'HOME') ? `/${item.name}` : folderTree.slice(1).join('/').concat(`/${item.name}`),
        fileSize: item.size,
        fileType: (item.folder) ? 'folder' : checkFileType(item.name)
      }
    }
    )
  )
  const { data: fileListData, error: fileListError, isLoading: fileListIsLoading } = useSWR((folderTree.join('/') === 'HOME') ? '/' : folderTree.slice(1).join('/'), fileListFetcher, { revalidateOnFocus: false })

  /**
   * 点击文件夹导航
   * @param index
   */
  const handleListNavClick = (index: number) => {
    setFolderTree(folderTree.slice(0, index + 1))
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
        ?
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
        :
        <FileList
          fileList={fileListData}
          folderTree={folderTree}
          setFolderTree={setFolderTree}
        />
      }
    </div>
  )
}

export default FilesView