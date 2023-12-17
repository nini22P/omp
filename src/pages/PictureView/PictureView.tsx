import useFilesData from '@/hooks/graph/useFilesData'
import usePictureStore from '@/store/usePictureStore'
import { filePathConvert } from '@/utils'
import { CloseOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import useSWRImmutable from 'swr/immutable'
import PictureList from './PictureList'

const PictureView = () => {

  const [
    currentPicture,
    updatePictureList,
    updateCurrentPicture,
  ] = usePictureStore(
    state => [
      state.currentPicture,
      state.updatePictureList,
      state.updateCurrentPicture,
    ]
  )

  const open = currentPicture !== null

  const { getFileData } = useFilesData()

  const path = currentPicture ? filePathConvert(currentPicture.filePath) : null

  const urlFetcher = async () => {
    if (path) {
      const res = await getFileData(path)
      return res['@microsoft.graph.downloadUrl']
    } else
      return null
  }

  const { data: imgUrl, isLoading } = useSWRImmutable(path ? `${path}-url` : null, urlFetcher)

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
      <DialogContent sx={{ padding: 0 }}>
        <Box
          width='100%'
          height='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          {(isLoading)
            ? <CircularProgress />
            : <img
              src={imgUrl}
              alt={currentPicture?.fileName}
              style={{ width: 'auto', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          }
          <PictureList />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PictureView
