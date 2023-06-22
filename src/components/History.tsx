import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import DeleteIcon from '@mui/icons-material/Delete'
import MovieIcon from '@mui/icons-material/Movie'
import useHistoryStore from '../store/useHistoryStore'
import { shallow } from 'zustand/shallow'
import { fileSizeConvert } from '../util'
import usePlayListStore from '../store/usePlayListStore'
import { HistoryItem } from '../type'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)
  const [updateType, updatePlayList, updateCurrent] = usePlayListStore((state) => [state.updateType, state.updatePlayList, state.updateCurrent], shallow)
  const handleClickListItem = (fileType: HistoryItem['fileType'], filePath: HistoryItem['filePath']) => {
    if (historyList) {
      let current = 0
      const list = historyList
        .filter((item) => item.fileType === fileType)
        .map((item, index) => {
          if (filePath === item.filePath)
            current = index
          return {
            index: index,
            title: item.fileName,
            size: item.fileSize,
            path: item.filePath,
          }
        })
      updatePlayList(list)
      updateType(fileType)
      updateCurrent(current)
    }
  }

  // const { getAppRootData, uploadAppRootData } = useFilesData()
  // getAppRootData('/').then(res => console.log(res))
  // uploadAppRootData('history.json', JSON.stringify(historyList))
  return (
    <div>
      <List>
        {
          historyList?.map((historyListItem, index) =>
            <ListItem
              key={index}
              alignItems='center'
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeHistoryItem(historyListItem.filePath)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                onClick={() => handleClickListItem(historyListItem.fileType, historyListItem.filePath)}
              >
                <ListItemIcon>
                  {historyListItem.fileType === 'audio' && <MusicNoteIcon />}
                  {historyListItem.fileType === 'video' && <MovieIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={historyListItem.fileName}
                  secondary={`${historyListItem.lastTime}, ${fileSizeConvert(historyListItem.fileSize)}`}
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
              </ListItemButton>
            </ListItem>
          )
        }
      </List>
    </div>
  )
}

export default History