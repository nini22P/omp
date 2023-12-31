import { File } from '@/types/file'
import { sizeConvert } from '@/utils'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { ListItem, IconButton, ListItemButton, ListItemAvatar, Avatar, ListItemText, ListItemIcon } from '@mui/material'
import { useTranslation } from 'react-i18next'

const CommonListItem = ({
  item,
  active,
  handleClickItem,
  handleClickMenu,
}: {
  item: File,
  active?: boolean,
  handleClickItem: (item: File) => void,
  handleClickMenu: (event: React.MouseEvent<HTMLElement>, currentFile: File) => void,
}) => {

  const { t } = useTranslation()

  return (
    <ListItem
      disablePadding
      secondaryAction={
        (item.fileType === 'audio' || item.fileType === 'video')
        &&
        <div>
          <IconButton
            aria-label={t('common.more')}
            onClick={(event) =>
              handleClickMenu(event,
                {
                  fileName: item.fileName,
                  filePath: item.filePath,
                  fileSize: item.fileSize,
                  fileType: item.fileType,
                  id: item.id,
                }
              )}
          >
            <MoreVertRoundedIcon />
          </IconButton>
        </div>
      }
    >
      <ListItemButton
        onClick={() => handleClickItem(item)}
        className={active ? 'active' : ''}
      >
        <ListItemAvatar sx={{ position: 'relative' }}>
          <ListItemIcon sx={{ paddingLeft: 1 }}>
            {item.fileType === 'folder' && <FolderOpenRoundedIcon />}
            {item.fileType === 'audio' && <MusicNoteRoundedIcon />}
            {item.fileType === 'video' && <MovieRoundedIcon />}
            {item.fileType === 'picture' && <InsertPhotoRoundedIcon />}
            {item.fileType === 'other' && <InsertDriveFileRoundedIcon />}
          </ListItemIcon>
          {
            (item.thumbnails && item.thumbnails[0])
            &&
            <Avatar
              variant="square"
              alt={item.fileName}
              src={item.thumbnails[0].small.url}
              imgProps={{ loading: 'lazy' }}
              sx={{
                position: 'absolute',
                left: 0,
                top: -6,
                borderRadius: '0.5rem',
              }}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.style.display = 'none'
              }}
            />
          }
        </ListItemAvatar>

        <ListItemText
          primary={item.fileName}
          secondary={
            `${sizeConvert(item.fileSize)}
            ${item.lastModifiedDateTime
              ? ` • ${new Date(item.lastModifiedDateTime).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}`
              : ''}`
          }
        />
      </ListItemButton>
    </ListItem>
  )
}

export default CommonListItem