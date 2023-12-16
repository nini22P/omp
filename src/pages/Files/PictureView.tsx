import useFilesData from '@/hooks/graph/useFilesData'
import usePictureStore from '@/store/usePictureStore'
import { filePathConvert } from '@/utils'
import { CloseOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import useSWRImmutable from 'swr/immutable'

const PictureView = () => {

  const [
    pictureList,
    currentPicture,
    updatePictureList,
    updateCurrentPicture,
  ] = usePictureStore(
    state => [
      state.pictureList,
      state.currentPicture,
      state.updatePictureList,
      state.updateCurrentPicture,
    ]
  )

  const open = pictureList.length > 0

  const { getFileData } = useFilesData()

  const path = currentPicture ? filePathConvert(currentPicture.filePath) : null

  const urlFetcher = async () => {
    if (path) {
      const res = await getFileData(path)
      return res['@microsoft.graph.downloadUrl']
    } else
      return null
  }

  const { data: imgUrl, isLoading } = useSWRImmutable(path ? path : null, urlFetcher)

  const handleClose = () => {
    updatePictureList([])
    updateCurrentPicture(null)
  }

  return (
    <Dialog
      fullScreen
      maxWidth='lg'
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          marginTop: 'calc(env(titlebar-area-height, 0) + 1px)',
          boxShadow: 'none',
          height: '-webkit-fill-available',
        },
        '& .MuiBackdrop-root': {
          background: 'transparent',
        }
      }}
    // className='pt-titlebar-area-height'
    >
      <DialogTitle padding='1rem !important' display='flex' alignItems={'center'} gap={2} lineHeight={1} overflow={'hidden'}>
        <IconButton onClick={(handleClose)}><CloseOutlined /></IconButton>
        {currentPicture?.fileName}
      </DialogTitle>
      <DialogContent>
        <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
          {(isLoading)
            ? <CircularProgress />
            : <img
              src={imgUrl}
              alt={currentPicture?.fileName}
              style={{ width: 'auto', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          }
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PictureView
