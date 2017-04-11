import { getFlattenList, getSelectedNodeIndex } from "./nodes";
import { findAlbums, findArtists, findSimilar, findTracks } from "../services/lastfm";

export const moveRight = () => (dispatch, getState) => {
  let nodes = getFlattenList(getState());
  const selectedIndex = getSelectedNodeIndex(nodes);
  const selectedNode = nodes[selectedIndex];

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