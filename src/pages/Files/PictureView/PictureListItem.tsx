import useFilesData from '@/hooks/graph/useFilesData'
import useTheme from '@/hooks/ui/useTheme'
import usePictureStore from '@/store/usePictureStore'
import { File, Thumbnails } from '@/types/file'
import { CircularProgress, Paper } from '@mui/material'
import useSWRImmutable from 'swr/immutable'

const PictureListItem = ({ picture }: { picture: File }) => {

  const { styles } = useTheme()

  const [
    currentPicture,
    updateCurrentPicture,
  ] = usePictureStore(
    state => [
      state.currentPicture,
      state.updateCurrentPicture,
    ]
  )

  const isCurrent = currentPicture?.id === picture.id

  const { getFileThumbnailsData } = useFilesData()

  const thumbnailsFetcher = async () => {
    const res = await getFileThumbnailsData(picture.id)
    return res.value[0]
  }

  const { data: thumbnails, isLoading } = useSWRImmutable<Thumbnails>(`${picture.id}-thumbnails`, thumbnailsFetcher)

  return (
    <Paper
      onClick={() => updateCurrentPicture(picture)}
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
      {
        isLoading
          ? <CircularProgress />
          : <img
            src={thumbnails?.medium.url}
            alt={picture.fileName}
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
          />
      }
    </Paper>
  )
}

export default PictureListItem