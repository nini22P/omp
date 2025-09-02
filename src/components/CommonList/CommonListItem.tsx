import { FileNode, Track } from '@/types/file'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { ListItem, IconButton, ListItemButton, ListItemAvatar, Avatar, ListItemText, ListItemIcon, useTheme } from '@mui/material'
import { useLingui } from '@lingui/react/macro'
import checkFileType from '@/utils/checkFileType'
import { sizeConv } from '@/utils/remote'

const CommonListItem = ({
  item,
  index,
  active,
  selected,
  isSelectMode,
  handleClickItem,
  handleClickMenu,
}: {
  item: FileNode | Track,
  index: number,
  active?: boolean
  selected?: boolean,
  isSelectMode?: boolean,
  handleClickItem: (index: number) => void,
  handleClickMenu: (event: React.MouseEvent<HTMLElement>, index: number) => void,
}) => {
  const { t } = useLingui()
  const theme = useTheme()

  const type = checkFileType(item.name)

  return (
    <ListItem
      disablePadding
      secondaryAction={
        (type === 'audio' || type === 'video') && !isSelectMode &&
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
            {'folder' in item && item.folder === 1 && <FolderOpenRoundedIcon />}
            {!('folder' in item) && type === 'audio' && <MusicNoteRoundedIcon />}
            {!('folder' in item) && type === 'video' && <MovieRoundedIcon />}
            {!('folder' in item) && type === 'picture' && <InsertPhotoRoundedIcon />}
            {!('folder' in item) && type === 'other' && <InsertDriveFileRoundedIcon />}
          </ListItemIcon>
          {
            'thumbnails' in item &&
            (item.thumbnails && item.thumbnails[0])
            &&
            <Avatar
              variant="square"
              alt={item.name}
              src={item.thumbnails[0].small.url}
              slotProps={{ img: { loading: 'lazy' } }}
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
          primary={item.name}
          secondary={
            `${'size' in item && item.size && sizeConv(item.size)}
            ${'lastModifiedDateTime' in item && item.lastModifiedDateTime
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