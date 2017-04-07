import { getFlattenList, getSelectedNodeIndex } from "./nodes";
import { findAlbums, findArtists } from "../services/lastfm";

export const moveRight = () => (dispatch, getState) => {
  let nodes = getFlattenList(getState());
  const selectedIndex = getSelectedNodeIndex(nodes);
  const selectedNode = nodes[selectedIndex];

  dispatch({ type: 'move_right' });

  if (!selectedNode.child) {
    dispatch(selectedNode.onOpen());
  }

};

export const lookForArtists = (term) => (dispatch) =>
  findArtists(term)
    .then(artists => dispatch({ type: 'search_done', artists }));

export const lookForAlbums = (artist, id) => (dispatch) =>
  findAlbums(artist)
    .then(albums => dispatch({ type: 'loaded', id, items: albums }));