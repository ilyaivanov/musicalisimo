// new events
import {createSelectedPath} from '../../Reducers/nodes.traversal';
import {findAlbums, findSimilar, findTracks} from '../../services/lastfm';
import {AppState, GetState, Path} from '../../types';
import {Dispatch} from 'react-redux';
import {getPreviousNodePath} from '../../Reducers/nodes.movement';

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

// TODO: extract tab, path, nodes
export const startEditNode = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  dispatch({type: 'start_edit_node', selectionPath});
};

export const stopEditNode = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  dispatch({type: 'stop_edit_node', selectionPath});
};

export const addPlaylist = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  dispatch({type: 'add_playlist', selectionPath});
};

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

export const defaultAction = (action) => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  // tab is empty
  if (selectedTab.nodes.size === 0) {
    return;
  }
  // no nodes selected
  if (selectionPath.length === 0) {
    dispatch(moveDown());
  }

  dispatch(action);
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

const handleMoveRight = (selectionPath, selectedNode, dispatch) => {
  if (selectedNode.get('child') && !selectedNode.get('isHidden')) {
    dispatch({type: 'move_selection_right'});
  } else if (selectedNode.get('child') && selectedNode.get('isHidden')) {
    dispatch({type: 'show', selectionPath});
  } else {
    if (selectedNode.get('type') === 'similar_artist') {
      dispatch(markNodeAsLoading(selectionPath));
      return findSimilar(selectedNode.get('artistName'))
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
      return findAlbums(selectedNode.get('text'))
        .then(albums => dispatch({
          type: 'loaded',
          itemType: 'album',
          selectionPath,
          nodes: albums,
        }))
        .then(() => dispatch(markNodeAsLoaded(selectionPath)));
    } else if (selectedNode.get('type') === 'album') {
      dispatch(markNodeAsLoading(selectionPath));
      return findTracks(selectedNode.get('artistName'), selectedNode.get('albumName'))
        .then(albumDetails => dispatch({
          type: 'loaded',
          itemType: 'track',
          selectionPath,
          nodes: albumDetails.tracks,
        }))
        .then(() => dispatch(markNodeAsLoaded(selectionPath)));
    }
  }

  // TODO: make a better design of this function
  return;
};

export const moveRight = () => (dispatch: Dispatch<any>, getState: GetState): Promise<any> | undefined => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);

  return handleMoveRight(selectionPath, selectedNode, dispatch);
};

export const handleNodeSwappingRight = () => (dispatch: Dispatch<any>, getState: GetState) => {
  // TODO: extract common pattern of retrieving selected tab path and node
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const previousNodePath = getPreviousNodePath(selectionPath);
  const previousNode = selectedTab.nodes.getIn(previousNodePath);
  if (!previousNode.get('child') && !(previousNode.get('type') === 'track')) {
    (handleMoveRight(previousNodePath, previousNode, dispatch) as any)
      .then(() => dispatch(swapNodeRight()));
  } else {
    dispatch(swapNodeRight());
  }
};

export const artistLoaded = (artists: any) => (dispatch: Dispatch<any>) => {
  dispatch({type: 'search_done', artists});
};

export const selectSearch = () => ({
  type: 'select_search'
});

export const selectFavorites = () => ({
  type: 'select_favorites'
});

export const selectSearchTerm = () => ({
  type: 'select_search_term'
});

export const updateNodeText = (text) => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  dispatch({
    text,
    selectionPath,
    type: 'update_node_text',
  });
};

