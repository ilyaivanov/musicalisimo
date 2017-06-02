// new events
import { createSelectedPath } from '../../Reducers/nodes.traversal';
import { findAlbums, findSimilar, findTracks } from "../../services/lastfm";
export const moveDown = () =>
  ({ type: 'move_selection_down' });

export const moveUp = () =>
  ({ type: 'move_selection_up' });

export const addNodeToFavorites = () => (dispatch, getState) => {
  const selectionPath = createSelectedPath(getState().search.nodes);
  const selectedNode = getState().search.nodes.getIn(selectionPath);
  dispatch({
    type: 'add_to_favorites',
    node: selectedNode,
  });
};

export const getSelectedTab = (state) => {
  return state.search.isFocused ?
    state.search : state.favorites;
};
export const moveLeft = () => (dispatch, getState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);
  if (selectedNode.get('isHidden') || !selectedNode.get('child'))
    dispatch({ type: 'move_selection_left' });
  else
    dispatch({ type: 'hide', selectionPath });
};

export const moveRight = () => (dispatch, getState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);

  if (selectedNode.get('child') && !selectedNode.get('isHidden')) {
    dispatch({ type: 'move_selection_right' });
  } else if (selectedNode.get('child') && selectedNode.get('isHidden')) {
    dispatch({ type: 'show', selectionPath });
  } else {
    if (selectedNode.get('type') === 'similar_artist') {
      findSimilar(selectedNode.get('artistName'))
        .then(artists =>
          dispatch({
            type: 'loaded',
            itemType: 'artist',
            selectionPath,
            nodes: artists,
          })
        )
    }
    if (selectedNode.get('type') === 'artist')
      findAlbums(selectedNode.get('text'))
        .then(albums => dispatch({
          type: 'loaded',
          itemType: 'album',
          selectionPath,
          nodes: albums,
        }));
    else if (selectedNode.get('type') === 'album')
      findTracks(selectedNode.get('artistName'), selectedNode.get('albumName'))
        .then(albumDetails => dispatch({
          type: 'loaded',
          itemType: 'track',
          selectionPath,
          nodes: albumDetails.tracks,
        }));
  }
};

