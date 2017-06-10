import {ActionNames, PlayerActions, PlayerState} from './types';

export default (state: PlayerState = {}, action: PlayerActions): PlayerState => {
  if (action.type === ActionNames.PLAY) {
    return {
      ...state,
      currentArtist: action.node.get('artistName'),
      currentAlbum: action.node.get('albumName'),
      currentTrack: action.node.get('trackName'),
      artistImage: action.node.get('artistImage'),
      albumImage: action.node.get('albumImage'),
    };
  }
  if (action.type === ActionNames.PLAY_LOADED) {
    return {
      ...state,
      video: action.video,
    };
  }
  return state;
};