import { File } from '@/types/file'
import { Paper, useTheme } from '@mui/material'

const PictureListItem = ({ picture, isCurrent }: { picture: File, isCurrent: boolean }) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        height: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: '1/1',
        cursor: 'pointer',
        outline: isCurrent ? `3px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`,
      }}
    >
      <img
        src={picture.thumbnails ? picture.thumbnails[0].medium.url : ''}
        alt={picture.fileName}
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem' }}
        loading='lazy'
      />
    </Paper>
  )
}

export default PictureListItem