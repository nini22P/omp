import usePictureStore from '@/store/usePictureStore'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Dialog, IconButton, Tooltip } from '@mui/material'
import PictureList from './PictureList'
import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { t } from '@lingui/macro'

const PictureView = () => {

  const [
    currentPicture,
    updatePictureList,
    updateCurrentPicture,
  ] = usePictureStore(
    useShallow(
      (state) => [
        state.currentPicture,
        state.updatePictureList,
        state.updateCurrentPicture,
      ]
    )
  )

  const open = currentPicture !== null

  const handleClose = () => {
    updatePictureList([])
    updateCurrentPicture(null)
  }

  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(
    () => {
      const imageElement = imgRef.current
      if (imageElement) {
        imageElement.src = currentPicture?.url || ''
      }
      return () => {
        if (imageElement)
          imageElement.src = ''
      }
    },
    [currentPicture?.url]
  )

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
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
        }}
      >
        <Box padding='0.5rem' display='flex' alignItems={'center'} gap={2} overflow={'hidden'}>
          <Tooltip title={t`Close`}>
            <IconButton onClick={(handleClose)}>
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
          {currentPicture?.fileName}
        </Box>
        <Box sx={{ height: 0, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            ref={imgRef}
            src={currentPicture?.url}
            alt={currentPicture?.fileName}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </Box>
        <PictureList />
      </Box>
    </Dialog>
  )
}

export default PictureView
