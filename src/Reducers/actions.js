import { getFlattenList, getSelectedNodeIndex } from "./nodes";
import { findAlbums, findArtists, findSimilar, findTracks } from "../services/lastfm";

const getSelectedNode = getState => {
  const nodes = getState().search.isFocused ? getState().search.nodes : getState().favorites.nodes;
  const flatNodes = getFlattenList(nodes);
  const selectedIndex = getSelectedNodeIndex(flatNodes);
  return flatNodes[selectedIndex];
};

export const lookForArtists = (term) => (dispatch) =>
  findArtists(term)
    .then(artists => dispatch({ type: 'search_done', artists }));

export const lookForSimilarArtists = (artistName, id) => (dispatch) =>
  findSimilar(artistName)
    .then(artists => dispatch({ type: 'loaded', itemType: 'artist', items: artists, id }));

export const lookForAlbums = (artist, id) => (dispatch) =>
  findAlbums(artist)
    .then(albums => dispatch({ type: 'loaded', itemType: 'album', id, items: albums }));

export const lookForTracks = (artist, album, id) => (dispatch) =>
  findTracks(artist, album)
    .then(info => dispatch({ type: 'loaded', itemType: 'track', id, items: info.tracks }));

export const addSelectedItemToFavorites = () => (dispatch, getState) =>
  dispatch({ type: 'add_to_favorites', item: getSelectedNode(getState) });


export const focusSearch = () => (dispatch) => {
  dispatch({ type: 'focus_search' });
};

export const moveRight = () => (dispatch, getState) => {
  const selectedNode = getSelectedNode(getState);

  const isTrack = !!selectedNode.duration;
  if (isTrack)
    return;

  dispatch({ type: 'move_right' });

  if (!selectedNode.child) {
    if(selectedNode.isSpecial){ // right now only for Similar
      return dispatch(lookForSimilarArtists(selectedNode.artistName, selectedNode.id));
    }
    if (!selectedNode.artistName) {
      return dispatch(lookForAlbums(selectedNode.text, selectedNode.id));
    }
    else if (!selectedNode.trackName) {
      return dispatch(lookForTracks(selectedNode.artistName, selectedNode.albumName, selectedNode.id));
    }
    console.log('openning track is not yet supported');
    return dispatch({ type: 'open_Tracks_not_yet_supported' })
  }
};


export const focusFavorites = () => (dispatch) => {
  dispatch({ type: 'focus_favorites' });
};
