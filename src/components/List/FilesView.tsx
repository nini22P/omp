import { Breadcrumbs, Button, CircularProgress } from '@mui/material'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import { checkFileType, shufflePlayQueue } from '../../util'
import usePlayerStore from '../../store/usePlayerStore'
import { useState } from 'react'
import useFilesData from '../../hooks/useFilesData'
import useSWR from 'swr'
import FileList from './FileList'
import { FileItem } from '../../type'

const FilesView = () => {

  const [folderTree, setFolderTree] = useState(['HOME'])
  const { getFilesData } = useFilesData()
  const [updateType, updatePlayQueue, updateCurrent] = usePlayQueueStore((state) => [state.updateType, state.updatePlayQueue, state.updateCurrent], shallow)
  const shuffle = usePlayerStore(state => state.shuffle)

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

  /**
 * 点击列表项
 * @param filePath 
 */
  const handleListClick = (filePath: string) => {
    const currentFile: FileItem = fileListData?.find((item: FileItem) => item.filePath === filePath)
    console.log('点击的项目', filePath)
    // 点击文件夹时打开列表
    if (currentFile.fileType === 'folder') {
      setFolderTree([...folderTree, currentFile.fileName])
    }
    // 点击媒体文件时添加到播放队列
    if (currentFile.fileType === 'audio' || currentFile.fileType === 'video') {
      let current = 0
      const lists = fileListData
        ?.filter((item: FileItem) => {
          if (currentFile.fileType === 'audio')
            return item.fileType === 'audio'
          if (currentFile.fileType === 'video')
            return item.fileType === 'video'
          return false
        })
        .map((item: FileItem, index: number) => {
          if (filePath === item.filePath)
            current = index
          return {
            index: index,
            title: item.fileName,
            size: item.fileSize,
            path: item.filePath,
          }
        })
      if (lists.length !== 0) {
        updateCurrent(current)
        updateType(currentFile.fileType)
        if (shuffle)
          updatePlayQueue(shufflePlayQueue(lists, current))
        else
          updatePlayQueue(lists)
      }
    }
  }

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
          handleClickListItem={handleListClick}
        />
      }
    </div>
  )
}

export default FilesView