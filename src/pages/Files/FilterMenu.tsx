import useUiStore from '@/store/useUiStore'
import { SortOutlined } from '@mui/icons-material'
import { Checkbox, Divider, FormControlLabel, FormGroup, IconButton, Menu, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const FilterMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [
    sortBy,
    orderBy,
    foldersFirst,
    mediaOnly,
    updateSortBy,
    updateOrderBy,
    updateFoldersFirst,
    updateMediaOnly,
  ] = useUiStore(
    (state) => [
      state.sortBy,
      state.orderBy,
      state.foldersFirst,
      state.mediaOnly,
      state.updateSortBy,
      state.updateOrderBy,
      state.updateFoldersFirst,
      state.updateMediaOnly,
    ]
  )

  const { t } = useTranslation()

  return (
    <div>
      <IconButton
        id="filter-button"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SortOutlined />
      </IconButton>

      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
        sx={{ userSelect: 'none' }}
      >
        <RadioGroup
          aria-labelledby="sort-radio-buttons-group-label"
          defaultValue={sortBy}
          name="sort-radio-buttons-group"
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel value="name" control={<Radio />} label={t('files.sortBy.name')} onChange={() => updateSortBy('name')} />
          <FormControlLabel value="size" control={<Radio />} label={t('files.sortBy.size')} onChange={() => updateSortBy('size')} />
          <FormControlLabel value="datetime" control={<Radio />} label={t('files.sortBy.lastModified')} onChange={() => updateSortBy('datetime')} />
        </RadioGroup>

        <Divider />

        <RadioGroup
          aria-labelledby="order-radio-buttons-group-label"
          defaultValue={orderBy}
          name="order-radio-buttons-group"
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel value="asc" control={<Radio />} label={t('files.orderBy.asc')} onChange={() => updateOrderBy('asc')} />
          <FormControlLabel value="desc" control={<Radio />} label={t('files.orderBy.desc')} onChange={() => updateOrderBy('desc')} />
        </RadioGroup>

        <Divider />

        <FormGroup
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel control={<Checkbox checked={foldersFirst} />} label={t('files.foldersFirst')} onChange={() => updateFoldersFirst(!foldersFirst)} />
          <FormControlLabel control={<Checkbox checked={mediaOnly} />} label={t('files.mediaOnly')} onChange={() => updateMediaOnly(!mediaOnly)} />
        </FormGroup>

      </Menu>
    </div>

  )
}

export default FilterMenu