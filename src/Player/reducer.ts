export default (state = {}, action: any) => {
  if (action.type === 'play') {
    return {
      ...state,
      currentArtist: action.node.get('artistName'),
      currentAlbum: action.node.get('albumName'),
      currentTrack: action.node.get('trackName'),
      artistImage: action.node.get('artistImage'),
      albumImage: action.node.get('albumImage'),
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