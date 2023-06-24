import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import DeleteIcon from '@mui/icons-material/Delete'
import MovieIcon from '@mui/icons-material/Movie'
import useHistoryStore from '../store/useHistoryStore'
import { shallow } from 'zustand/shallow'
import { checkFileType, fileSizeConvert } from '../util'
import usePlayQueueStore from '../store/usePlayQueueStore'
import { HistoryItem } from '../type'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)
  const [updateType, updatePlayQueue, updateCurrent] = usePlayQueueStore((state) => [state.updateType, state.updatePlayQueue, state.updateCurrent], shallow)
  const handleClickListItem = (fileName: HistoryItem['fileName'], filePath: HistoryItem['filePath']) => {
    if (historyList) {
      let current = 0
      const fileType = checkFileType(fileName)
      const list = historyList
        .filter((item) => checkFileType(item.fileName) === fileType)
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
      updatePlayQueue(list)
      updateType(fileType)
      updateCurrent(current)
    }
  }

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
                onClick={() => handleClickListItem(historyListItem.fileName, historyListItem.filePath)}
              >
                <ListItemIcon>
                  {checkFileType(historyListItem.fileName) === 'audio' && <MusicNoteIcon />}
                  {checkFileType(historyListItem.fileName) === 'video' && <MovieIcon />}
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