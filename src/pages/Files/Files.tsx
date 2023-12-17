import useSWR from 'swr'
import useUiStore from '../../store/useUiStore'
import useFilesData from '../../hooks/graph/useFilesData'
import BreadcrumbNav from './BreadcrumbNav'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'
import { checkFileType, filePathConvert } from '../../utils'
import { File, Thumbnail } from '../../types/file'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import FilterMenu from './FilterMenu'
import PictureView from '../PictureView/PictureView'

const Files = () => {

  const [
    folderTree,
    sortBy,
    orderBy,
    foldersFirst,
    mediaOnly,
  ] = useUiStore(
    (state) => [
      state.folderTree,
      state.sortBy,
      state.orderBy,
      state.foldersFirst,
      state.mediaOnly,
    ]
  )

  const { getFilesData } = useFilesData()

  const fileListFetcher = async (path: string) => {
    interface ResItem {
      name: string;
      size: number;
      lastModifiedDateTime: string;
      id: string;
      thumbnails: Thumbnail[];
      folder: { childCount: number, view: { sortBy: string, sortOrder: string, viewType: string } };
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
        }
      })
  }

  const { data: fileListData, error: fileListError, isLoading: fileListIsLoading } = useSWR<File[], Error>(filePathConvert(folderTree), fileListFetcher, { revalidateOnFocus: false })

  const filteredFileList = (!fileListData)
    ? []
    : fileListData.filter((item) => mediaOnly ? item.fileType !== 'other' : true)

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

  return (
    <div>
      <Grid container
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'
      >
        <Grid>
          <BreadcrumbNav />
        </Grid>
        <Grid xs={'auto'} paddingRight={2}>
          <FilterMenu />
        </Grid>
      </Grid>
      {
        (fileListIsLoading || !fileListData || !sortedFileList || fileListError)
          ? <Loading />
          : <CommonList
            listData={sortedFileList}
            multiColumn
          />
      }
      <PictureView />
    </div>
  )
}

export default Files