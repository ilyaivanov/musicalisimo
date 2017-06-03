export default (state = {}, action: any) => {
  if (action.type === 'play') {
    return {
      ...state,
      currentArtist: action.node.get('artistName'),
      currentAlbum: action.node.get('albumName'),
      currentTrack: action.node.get('trackName'),
    };
  }
  if (action.type === 'play_loaded') {
    return {
      ...state,
      video: action.video,
    };
  }
  return state;
}