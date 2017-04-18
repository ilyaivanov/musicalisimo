import { getFlattenList, getSelectedNodeIndex } from "./nodes";
import { findAlbums, findArtists, findSimilar, findTracks } from "../services/lastfm";

const getSelectedNode = getState => {
  let nodes = getFlattenList(getState().nodes);
  const selectedIndex = getSelectedNodeIndex(nodes);
  return nodes[selectedIndex];
};

export const moveRight = () => (dispatch, getState) => {
  const selectedNode = getSelectedNode(getState);

  const isTrack = !!selectedNode.duration;
  if (isTrack)
    return;

  dispatch({ type: 'move_right' });

  if (!selectedNode.child) {
    dispatch(selectedNode.onOpen());
  }

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

export const addSelectedItemToFavorites = () => (dispatch, getState) => {
  const selectedNode = getSelectedNode(getState);
  dispatch({ type: 'add_to_favorites', item: selectedNode });
}
