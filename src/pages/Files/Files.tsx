import useSWR from 'swr'
import useUiStore from '../../store/useUiStore'
import useFilesData from '../../hooks/graph/useFilesData'
import BreadcrumbNav from './BreadcrumbNav'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'
import { checkFileType, pathConvert } from '../../utils'
import { File, Thumbnail } from '../../types/file'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import FilterMenu from './FilterMenu'
import PictureView from '../PictureView/PictureView'
import { Divider, IconButton, InputBase } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Files = () => {

  const [
    folderTree,
    display,
    sortBy,
    orderBy,
    foldersFirst,
    mediaOnly,
    updateFolderTree,
  ] = useUiStore(
    (state) => [
      state.folderTree,
      state.display,
      state.sortBy,
      state.orderBy,
      state.foldersFirst,
      state.mediaOnly,
      state.updateFolderTree,
    ]
  )

  const { getFilesData } = useFilesData()

  const { t } = useTranslation()

  const [searchIsShow, setSearchIsShow] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const fileListFetcher = async (path: string): Promise<File[]> => {
    interface ResItem {
      name: string;
      size: number;
      lastModifiedDateTime: string;
      id: string;
      thumbnails: Thumbnail[];
      '@microsoft.graph.downloadUrl'?: string;
      folder?: { childCount: number, view: { sortBy: string, sortOrder: string, viewType: string } };
    }
    const res: ResItem[] = await getFilesData(path)

    return res
      .map((item) => {
        return {
          fileName: item.name,
          filePath: [...folderTree, item.name],
          fileSize: item.size,
          fileType: (item.folder) ? 'folder' : checkFileType(item.name),
          lastModifiedDateTime: item.lastModifiedDateTime,
          id: item.id,
          thumbnails: item.thumbnails,
          url: item['@microsoft.graph.downloadUrl'],
        }
      })
  }

  const { data: fileListData, error: fileListError, isLoading: fileListIsLoading } =
    useSWR<File[], Error>(pathConvert(folderTree), fileListFetcher, { revalidateOnFocus: false })

  const filteredFileList =
    !fileListData
      ? []
      : fileListData
        .filter((item) => item.fileName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
        .filter((item) => mediaOnly ? item.fileType !== 'other' : true)

  const sortedFileList = (!filteredFileList)
    ? []
    : filteredFileList.sort((a, b) => {
      if (foldersFirst) {
        if (a.fileType === 'folder' && b.fileType !== 'folder') {
          return -1
        } else if (a.fileType !== 'folder' && b.fileType === 'folder') {
          return 1
        }
      }

      if (sortBy === 'name') {
        if (orderBy === 'asc') {
          return (a.fileName).localeCompare(b.fileName)
        } else {
          return (b.fileName).localeCompare(a.fileName)
        }
      } else if (sortBy === 'size') {
        if (orderBy === 'asc') {
          return a.fileSize - b.fileSize
        } else {
          return b.fileSize - a.fileSize
        }
      } else if (sortBy === 'datetime' && a.lastModifiedDateTime && b.lastModifiedDateTime) {
        if (orderBy === 'asc') {
          return new Date(a.lastModifiedDateTime).getTime() - new Date(b.lastModifiedDateTime).getTime()
        } else {
          return new Date(b.lastModifiedDateTime).getTime() - new Date(a.lastModifiedDateTime).getTime()
        }
      } else return 0
    })

  const scrollFilePathRef = useRef<string[] | null>(null)

  const handleClickNav = (index: number) => {
    if (index < folderTree.length - 1) {
      scrollFilePathRef.current = folderTree.slice(0, index + 2)
      updateFolderTree(folderTree.slice(0, index + 1))
    }
  }

  const handleClickSearch = () => {
    setSearchIsShow(!searchIsShow)
    setSearchValue('')
  }

  useEffect(
    () => {
      setSearchValue('')
      setSearchIsShow(false)
    },
    [folderTree]
  )

  return (
    <Grid container
      sx={{
        height: '100%',
        overflow: 'auto',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
      }}>
      <Grid container
        xs={12}
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'
        padding='0.25rem 0.5rem'
        gap='0.25rem'
        minHeight='3.5rem'
      >
        <Grid xs>
          {
            searchIsShow
              ?
              <InputBase
                autoFocus
                fullWidth
                aria-label={t('common.search')}
                placeholder={t('common.search')}
                defaultValue={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{ marginX: '0.5rem' }}
              />
              :
              <BreadcrumbNav handleClickNav={handleClickNav} />
          }
        </Grid>
        <Grid xs={'auto'} sx={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center' }}>
          <IconButton
            onClick={handleClickSearch}
            aria-label={searchIsShow ? `${t('common.close')} ${t('common.search')}` : t('common.search')}>
            {searchIsShow ? <CloseRoundedIcon /> : <SearchRoundedIcon />}
          </IconButton>
          <FilterMenu />
        </Grid>
      </Grid>
      <Divider />
      <Grid xs={12} sx={{ flexGrow: 1, overflow: 'auto' }}>
        {
          (fileListIsLoading || !fileListData || !sortedFileList || fileListError)
            ? <Loading />
            : <CommonList
              display={display}
              listData={sortedFileList}
              listType='files'
              scrollFilePath={scrollFilePathRef.current || undefined}
            />
        }
      </Grid>
      <PictureView />
    </Grid>
  )
}

export default Files