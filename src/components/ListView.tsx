import { Breadcrumbs, Button, CircularProgress, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import { shallow } from 'zustand/shallow'
import usePlayListStore from '../store/usePlayListStore'
import { checkFileType, fileSizeConvert, shufflePlayList } from '../util'
import usePlayerStore from '../store/usePlayerStore'
import { useState } from 'react'
import useFilesData from '../hooks/useFilesData'
import useSWR from 'swr'

const ListView = () => {

  const [folderTree, setFolderTree] = useState(['Home'])
  const { getFilesData } = useFilesData()
  const [updateType, updatePlayList, updateCurrent] = usePlayListStore((state) => [state.updateType, state.updatePlayList, state.updateCurrent], shallow)
  const shuffle = usePlayerStore(state => state.shuffle)

  const fileListFetcher = (path: string) => getFilesData(path).then(res => res)
  const { data: fileListData, error: fileListError, isLoading: fileListIsLoading } = useSWR((folderTree.join('/') === 'Home') ? '/' : folderTree.slice(1).join('/'), fileListFetcher, { revalidateOnFocus: false })

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
 * @param index 
 * @param name 
 * @param fileType 
 */
  const handleListClick = (index: number, name: string) => {
    console.log('点击的项目', index, name)
    // 点击文件夹时打开列表
    if (fileListData[index].folder) {
      setFolderTree([...folderTree, name])
    }
    // 点击文件时将媒体文件添加到播放列表
    if (fileListData[index].file && name !== null) {
      let current = 0
      const lists = fileListData
        .filter((item: { name: string }) => {
          if (checkFileType(name) === 'audio')
            return checkFileType(item.name) === 'audio'
          if (checkFileType(name) === 'video')
            return checkFileType(item.name) === 'video'
          return false
        })
        .map((item: { name: string; size: number }, index: number) => {
          if (name === item.name)
            current = index
          return {
            index: index,
            title: item.name,
            size: item.size,
            path: (folderTree.join('/') === 'Home') ? '/' : folderTree.slice(1).join('/').concat(`/${item.name}`),
          }
        })
      if (lists.length !== 0) {
        updateCurrent(current)
        updateType(checkFileType(name))
        if (shuffle)
          updatePlayList(shufflePlayList(lists, current))
        else
          updatePlayList(lists)
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
        <Grid container spacing={1}>
          {
            fileListData.map((item: any, index: number) =>
              <Grid key={index} item lg={4} md={6} sm={12} xs={12} onClick={() => handleListClick(index, item.name)} >
                <ListItem disablePadding >
                  <ListItemButton>
                    <ListItemIcon>
                      {item.folder && <FolderIcon />}
                      {checkFileType(item.name) === 'audio' && <MusicNoteIcon />}
                      {checkFileType(item.name) === 'video' && <MovieIcon />}
                    </ListItemIcon>
                    <Grid container spacing={2} sx={{ overflow: 'hidden' }} wrap={'nowrap'}>
                      <Grid item xs zeroMinWidth>
                        <ListItemText
                          primary={item.name}
                          secondary={fileSizeConvert(item.size)}
                          primaryTypographyProps={{
                            style: {
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }}
                          secondaryTypographyProps={{
                            style: {
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </ListItemButton>
                </ListItem>
              </Grid>
            )
          }
        </Grid>}
    </div>
  )
}

export default ListView