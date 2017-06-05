// new events
import {createSelectedPath} from '../../Reducers/nodes.traversal';
import {findAlbums, findSimilar, findTracks} from '../../services/lastfm';
import {AppState, GetState, Path} from '../../types';
import {Dispatch} from 'react-redux';

export const moveDown = () =>
  ({type: 'move_selection_down'});

export const moveUp = () =>
  ({type: 'move_selection_up'});

export const swapNodeDown = () =>
  ({type: 'swap_selection_down'});

export const swapNodeUp = () =>
  ({type: 'swap_selection_up'});

export const swapNodeRight = () =>
  ({type: 'swap_selection_right'});

export const swapNodeLeft = () =>
  ({type: 'swap_selection_left'});

export const getSelectedTab = (state: AppState) => {
  return state.search.isFocused ?
    state.search : state.favorites;
};

export const addNodeToFavorites = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);
  dispatch({
    type: 'add_to_favorites',
    node: selectedNode,
  });
};

export const deleteNode = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  dispatch(moveDown());
  dispatch({
    type: 'delete_node',
    selectionPath,
  });
};

export const moveLeft = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);
  if (selectedNode.get('isHidden') || !selectedNode.get('child')) {
    dispatch({type: 'move_selection_left'});
  } else {
    dispatch({type: 'hide', selectionPath});
  }
};

const markNodeAsLoading = (selectionPath: Path) => ({
  type: 'node_started_loading',
  selectionPath,
});
const markNodeAsLoaded = (selectionPath: Path) => ({
  type: 'node_finished_loading',
  selectionPath,
});

export const moveRight = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);

  if (selectedNode.get('child') && !selectedNode.get('isHidden')) {
    dispatch({type: 'move_selection_right'});
  } else if (selectedNode.get('child') && selectedNode.get('isHidden')) {
    dispatch({type: 'show', selectionPath});
  } else {
    if (selectedNode.get('type') === 'similar_artist') {
      dispatch(markNodeAsLoading(selectionPath));
      findSimilar(selectedNode.get('artistName'))
        .then(artists =>
          dispatch({
            type: 'loaded',
            itemType: 'artist',
            selectionPath,
            nodes: artists,
          })
        )
        .then(() => dispatch(markNodeAsLoaded(selectionPath)));
    }
    if (selectedNode.get('type') === 'artist') {
      dispatch(markNodeAsLoading(selectionPath));
      findAlbums(selectedNode.get('text'))
        .then(albums => dispatch({
          type: 'loaded',
          itemType: 'album',
          selectionPath,
          nodes: albums,
        }))
        .then(() => dispatch(markNodeAsLoaded(selectionPath)));;

    } else if (selectedNode.get('type') === 'album') {
      dispatch(markNodeAsLoading(selectionPath));
      findTracks(selectedNode.get('artistName'), selectedNode.get('albumName'))
        .then(albumDetails => dispatch({
          type: 'loaded',
          itemType: 'track',
          selectionPath,
          nodes: albumDetails.tracks,
        }))
        .then(() => dispatch(markNodeAsLoaded(selectionPath)));;
    }
  }
};

