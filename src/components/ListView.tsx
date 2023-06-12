import { Breadcrumbs, Button, CircularProgress, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import usePlayListStore from '../store/usePlayListStore'

const ListView = ({ data, error, isLoading, folderTree, setFolderTree }
  : { data: any, error: Error | undefined, isLoading: boolean, folderTree: string[], setFolderTree: (arg0: string[]) => void }
) => {
  const [updateType, updatePlayList, updateIndex] = usePlayListStore(
    (state) => [
      state.updateType,
      state.updatePlayList,
      state.updateIndex,
    ]
  )

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
    if (data[index].folder) {
      setFolderTree([...folderTree, name])
    }
    // 点击文件时将媒体文件添加到播放列表
    if (data[index].file && name !== null) {
      const list = data.map((item: any) => {
        return {
          title: item.name,
          size: item.size,
          path: (folderTree.join('/') === 'Home') ? '/' : folderTree.slice(1).join('/').concat(`/${item.name}`),
        }
      })

      if (isAudio(name)) {
        const lists = list.filter((item: { title: string }) => isAudio(item.title))
        const index = lists.findIndex((obj: { title: string }) => obj.title === name)
        updateType('audio')
        updateIndex(index)
        updatePlayList(lists)
      }
      if (isVideo(name)) {
        const lists = list.filter((item: { title: string }) => isVideo(item.title))
        const index = lists.findIndex((obj: { title: string }) => obj.title === name)
        updateType('video')
        updateIndex(index)
        updatePlayList(lists)
      }
    }
  }

  const isAudio = (name: string) => (/.(wav|mp3|aac|ogg|flac|m4a|opus)$/i).test(name)
  const isVideo = (name: string) => (/.(mp4|mkv|avi|mov|rmvb|webm|flv)$/i).test(name)

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
      {(isLoading || !data || error)
        ?
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
        :
        <Grid container spacing={1}>
          {
            data.map((item: any, index: number) =>
              <Grid key={index} item lg={4} md={6} sm={12} xs={12} onClick={() => handleListClick(index, item.name)} >
                <ListItem disablePadding >
                  <ListItemButton>
                    <ListItemIcon>
                      {(item.folder) && <FolderIcon />}
                      {(isAudio(item.name) && <MusicNoteIcon />)}
                      {(isVideo(item.name)) && <MovieIcon />}
                    </ListItemIcon>
                    <Grid container spacing={2} sx={{ overflow: 'hidden' }} wrap={'nowrap'}>
                      <Grid item xs zeroMinWidth>
                        <ListItemText >
                          <Typography noWrap >
                            {item.name}
                          </Typography>
                        </ListItemText>
                      </Grid>
                      <Grid item>
                        <ListItemText>
                          <Typography variant="body2" color="text.secondary">
                            {
                              ((item.size / 1024) < 1024)
                                ? `${(item.size / 1024).toFixed(2)} KB`
                                : ((item.size / 1024 / 1024) < 1024)
                                  ? `${(item.size / 1024 / 1024).toFixed(2)} MB`
                                  : `${(item.size / 1024 / 1024 / 1024).toFixed(2)} GB`
                            }
                          </Typography>
                        </ListItemText>
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