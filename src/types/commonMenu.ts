export interface CommonMenuStatus {
  anchorEl: HTMLElement | null;
  menuOpen: boolean;
  dialogOpen: boolean;
  currentFile: null | File;
  handleClickRemove: null | ((filePathArray: string[][]) => void);
}

export interface CommonMenuAction {
  updateAnchorEl: (anchorEl: CommonMenuStatus['anchorEl']) => void;
  updateMenuOpen: (menuOpen: boolean) => void;
  updateDialogOpen: (dialogOpen: CommonMenuStatus) => void;
  updateCurrentFile: (currentFile: CommonMenuStatus['currentFile']) => void;
  updateHandleClickRemove: (handleClickRemove: CommonMenuStatus['handleClickRemove']) => void;
}