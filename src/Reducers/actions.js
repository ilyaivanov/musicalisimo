import { getFlattenList, getSelectedNodeIndex } from "./nodes";
import { findArtists } from "../services/lastfm";

let id = 10;

export const moveRight = () => (dispatch, getState) => {
  let nodes = getFlattenList(getState());
  const selectedIndex = getSelectedNodeIndex(nodes);
  const selectedNode = nodes[selectedIndex];

  dispatch({ type: 'move_right' });

  if (!selectedNode.child) {
    setTimeout(() => dispatch({
      type: 'loaded',
      id: selectedNode.id,
      items: [{ id: id++, text: 'new node' }, { id: id++, text: 'new node' }]
    }), 500);
  }

};

export const lookForArtists = (term) => (dispatch) =>
  findArtists(term)
    .then(artists => dispatch({ type: 'search_done', artists }));
