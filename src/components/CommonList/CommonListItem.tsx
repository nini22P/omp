import useTheme from '@/hooks/ui/useTheme'
import { File } from '@/types/file'
import { fileSizeConvert } from '@/utils'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import MovieIcon from '@mui/icons-material/Movie'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
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

  const { styles } = useTheme()
  const { t } = useTranslation()

  return (
    <ListItem
      disablePadding
      id={active ? 'playing-item' : ''}
      sx={{
        '& .MuiListItemButton-root': {
          paddingLeft: 3,
          // paddingRight: 9,
        },
        '& .MuiListItemSecondaryAction-root': {
          right: '4px',
        }
      }}
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
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      }
    >
      <ListItemButton
        onClick={() => handleClickItem(item)}
        sx={{
          '.MuiListItemText-root': {
            color: active ? styles.color.primary : ''
          },
          '.MuiListItemText-secondary': {
            color: active ? styles.color.primary : ''
          },
        }}
      >
        <ListItemAvatar sx={{ position: 'relative' }}>
          <ListItemIcon sx={{ paddingLeft: 1 }}>
            {item.fileType === 'folder' && <FolderOutlinedIcon />}
            {item.fileType === 'audio' && <MusicNoteIcon />}
            {item.fileType === 'video' && <MovieIcon />}
            {item.fileType === 'picture' && <InsertPhotoOutlinedIcon />}
            {item.fileType === 'other' && <InsertDriveFileOutlinedIcon />}
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
            `${item.lastModifiedDateTime
              ? `${new Date(item.lastModifiedDateTime).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })} | `
              : ''}${fileSizeConvert(item.fileSize)}`}
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
              textOverflow: 'ellipsis',
              fontWeight: 'lighter',
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default CommonListItem