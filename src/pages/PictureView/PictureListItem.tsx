import useStyles from '@/hooks/ui/useStyles'
import { File } from '@/types/file'
import { Paper } from '@mui/material'

const PictureListItem = ({ picture, isCurrent }: { picture: File, isCurrent: boolean }) => {

  const styles = useStyles()

  return (
    <Paper
      sx={{
        height: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: '1/1',
        cursor: 'pointer',
        // borderRadius: '4px',
        outline: isCurrent ? `3px solid ${styles.color.primary}` : `2px solid ${styles.color.shadow}`,
        // boxShadow: `1px 2px 2px -1px ${styles.color.shadow}`
      }}
    >
      <img
        src={picture.thumbnails ? picture.thumbnails[0].medium.url : ''}
        alt={picture.fileName}
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
        loading='lazy'
      />
    </Paper>
  )
}

export default PictureListItem