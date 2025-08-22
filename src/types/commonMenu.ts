import { FileNode, PlaylistItem } from './file'

export interface CommonMenuState {
  anchorEl: HTMLElement | null
  menuOpen: boolean
  dialogOpen: boolean
  currentFile: FileNode | PlaylistItem | null
  handleClickRemove: ((filePathArray: string[][]) => void) | null
}

export interface CommonMenuActions {
  updateAnchorEl: (anchorEl: CommonMenuState['anchorEl']) => void
  updateMenuOpen: (menuOpen: boolean) => void
  updateDialogOpen: (dialogOpen: CommonMenuState) => void
  updateCurrentFile: (currentFile: CommonMenuState['currentFile']) => void
  updateHandleClickRemove: (handleClickRemove: CommonMenuState['handleClickRemove']) => void
}