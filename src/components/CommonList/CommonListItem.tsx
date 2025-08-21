import { FileItem } from '@/types/file'
import { sizeConv } from '@/utils'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { ListItem, IconButton, ListItemButton, ListItemAvatar, Avatar, ListItemText, ListItemIcon, useTheme } from '@mui/material'
import { useLingui } from '@lingui/react/macro'

const CommonListItem = ({
  item,
  index,
  active,
  selected,
  isSelectMode,
  handleClickItem,
  handleClickMenu,
}: {
  item: FileItem,
  index: number,
  active?: boolean
  selected?: boolean,
  isSelectMode?: boolean,
  handleClickItem: (index: number) => void,
  handleClickMenu: (event: React.MouseEvent<HTMLElement>, index: number) => void,
}) => {
  const { t } = useLingui()

  const theme = useTheme()

  return (
    <ListItem
      disablePadding
      secondaryAction={
        (item.fileType === 'audio' || item.fileType === 'video') && !isSelectMode &&
        <div>
          <IconButton
            aria-label={t`More`}
            onClick={(event) => {
              event.stopPropagation()
              handleClickMenu(event, index)
            }}
          >
            <MoreVertRoundedIcon />
          </IconButton>
        </div>
      }
    >
      <ListItemButton
        onClick={() => handleClickItem(index)}
        className={active ? 'active' : ''}
        sx={{
          outline: selected ? `3px solid ${theme.palette.primary.main}55` : '',
          outlineOffset: '-5px'
        }}
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
            `${sizeConv(item.fileSize)}
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