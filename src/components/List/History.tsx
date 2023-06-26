import useHistoryStore from '../../store/useHistoryStore'
import { shallow } from 'zustand/shallow'
import { checkFileType } from '../../util'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import FileList from './FileList'

const History = () => {
  const [historyList, removeHistoryItem] = useHistoryStore((state) => [state.historyList, state.removeHistoryItem], shallow)
  const [updateType, updatePlayQueue, updateCurrent] = usePlayQueueStore((state) => [state.updateType, state.updatePlayQueue, state.updateCurrent], shallow)
  const handleClickListItem = (filePath: string) => {
    if (historyList) {
      const currentFile = historyList.find(item => item.filePath === filePath)
      if (currentFile && (currentFile.fileType === 'audio' || currentFile.fileType === 'video')) {
        let currentIndex = 0
        const list = historyList
          .filter((item) => checkFileType(item.fileName) === currentFile.fileType)
          .map((item, index) => {
            if (currentFile?.filePath === item.filePath)
              currentIndex = index
            return {
              index: index,
              title: item.fileName,
              size: item.fileSize,
              path: item.filePath,
            }
          })
        updatePlayQueue(list)
        updateType(currentFile.fileType)
        updateCurrent(currentIndex)
      }
    }
  }

  return (
    <>
      {
        (historyList)
        &&
        <FileList
          fileList={historyList}
          handleClickListItem={handleClickListItem}
          handleClickDelete={removeHistoryItem}
        />
      }
    </>
  )
}

export default History