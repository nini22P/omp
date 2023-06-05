const plyerReducer = (state: any, action: any) => {
  if (action.type === 'click_media') {
    return {
      ...state
    }

  }
  throw Error('Unknown action.');
}

export { plyerReducer }