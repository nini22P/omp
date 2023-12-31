import { IconButton, ListItemButton, useTheme } from '@mui/material'
import { File } from '@/types/file'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import useUtils from '@/hooks/useUtils'
import { sizeConvert } from '@/utils'

const CommonListItemCard = ({
  item,
  // active,
  handleClickItem,
  handleClickMenu,
}: {
  item: File,
  active?: boolean,
  handleClickItem: (item: File) => void,
  handleClickMenu: (event: React.MouseEvent<HTMLElement>, currentFile: File) => void,
}) => {

  const theme = useTheme()
  const { t } = useTranslation()
  const { getThumbnailUrl } = useUtils()

  const thumbnailUrl = getThumbnailUrl(item)

  return (
    <ListItemButton
      sx={{ width: '100%', height: '100%', padding: '0.5rem' }}
      onClick={() => handleClickItem(item)}
    >
      <Grid container sx={{ flexDirection: 'column', flexWrap: 'nowrap', width: '100%', height: '100%', gap: '0.25rem' }}>
        <Grid xs={12} sx={{ overflow: 'hidden', width: '100%', flexGrow: 1, borderRadius: '0.5rem', position: 'relative', border: `2px solid ${theme.palette.divider}` }}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
            {item.fileType === 'folder' && <FolderOpenRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {item.fileType === 'audio' && <MusicNoteRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {item.fileType === 'video' && <MovieRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {item.fileType === 'picture' && <InsertPhotoRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {item.fileType === 'other' && <InsertDriveFileRoundedIcon sx={{ width: '50%', height: '50%' }} />}
          </Grid>
          {
            thumbnailUrl
            &&
            <img
              src={thumbnailUrl}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.style.display = 'none'
              }}
              alt={item.fileName}
              style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover', }}
            />
          }
        </Grid>
        <Grid container xs={12} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', width: '24px', height: '24px' }} >
            {item.fileType === 'folder' && <FolderOpenRoundedIcon />}
            {item.fileType === 'audio' && <MusicNoteRoundedIcon />}
            {item.fileType === 'video' && <MovieRoundedIcon />}
            {item.fileType === 'picture' && <InsertPhotoRoundedIcon />}
            {item.fileType === 'other' && <InsertDriveFileRoundedIcon />}
          </Grid>
          <Grid container xs sx={{ justifyContent: 'center', alignItems: 'center' }} >
            <span style={{ display: 'block', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 'smaller', lineHeight: '1.5' }}>{item.fileName}</span>
            <span style={{ display: 'block', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 'x-small', fontWeight: 'lighter' }}>{sizeConvert(item.fileSize)}</span>
          </Grid>
          <Grid xs='auto'>
            {
              (item.fileType === 'audio' || item.fileType === 'video')
              &&
              <IconButton
                aria-label={t('common.more')}
                size='small'
                sx={{ padding: 0 }}
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  handleClickMenu(event,
                    {
                      fileName: item.fileName,
                      filePath: item.filePath,
                      fileSize: item.fileSize,
                      fileType: item.fileType,
                      id: item.id,
                    }
                  )
                }}
              >
                <MoreVertRoundedIcon />
              </IconButton>
            }
          </Grid>
        </Grid>
      </Grid>

    </ListItemButton>
  )
}

export default CommonListItemCard