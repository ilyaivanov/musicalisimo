// new events
import {createSelectedPath} from '../../Reducers/nodes.traversal';
import {findAlbums, findSimilar, findTracks} from '../../services/lastfm';
import {AppState, GetState, Path} from '../../types';
import {Dispatch} from 'react-redux';
import {getPreviousNodePath} from '../../Reducers/nodes.movement';

// UTILS
export const getSelectedTab = (state: AppState) => {
  return state.search.isFocused ?
    state.search : state.favorites;
};

const getSelectedNode = (getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  return selectedTab.nodes.getIn(selectionPath);
};

const createSelectionPathFromState = (getState: GetState) =>
  createSelectedPath(getSelectedTab(getState()).nodes);

const selectionAction = (actionName, actionProps?) => (dispatch: Dispatch<any>, getState: GetState) =>
  dispatch({
    type: actionName,
    selectionPath: createSelectionPathFromState(getState), ...actionProps
  });

export const defaultAction = (action) => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  if (selectedTab.nodes.size === 0) {
    return;
  }
  if (selectionPath.length === 0) {
    dispatch(moveDown());
  } else {
    dispatch(action);
  }

};

const createContextPath = (getState: GetState) =>
  createSelectedPath(getSelectedTab(getState()).nodes, 'isContext');

// ACTIONS
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

export const show = () => selectionAction('show');
export const hide = () => selectionAction('hide');

export const startEditNode = () => selectionAction('start_edit_node');
export const stopEditNode = () => selectionAction('stop_edit_node');
export const updateNodeText = (text) => selectionAction('update_node_text', {text});

export const addPlaylist = () => selectionAction('add_playlist');

export const createContext = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const contextPath = createContextPath(getState);
  if (contextPath.length > 0) {
    dispatch(removeContext());
  }
  dispatch(show());
  dispatch(selectionAction('create_context'));
  dispatch(moveDown());
};
export const removeContext = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const contextPath = createContextPath(getState);
  if (contextPath.length > 0) {
    dispatch({
      type: 'remove_context',
      selectionPath: contextPath,
    });
  }
};

export const deleteNode = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectionPath = createSelectionPathFromState(getState);
  dispatch(moveDown());
  dispatch({
    type: 'delete_node',
    selectionPath: selectionPath,
  });
};

export const addNodeToFavorites = () => (dispatch: Dispatch<any>, getState: GetState) =>
  dispatch({
    type: 'add_to_favorites',
    node: getSelectedNode(getState),
  });

export const moveLeft = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);
  if (selectedNode.get('isHidden') || !selectedNode.get('child')) {
    dispatch({type: 'move_selection_left'});
  } else {
    dispatch(hide());
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

const loadSimilar = (artistName: string, selectionPath, dispatch) =>
  findSimilar(artistName)
    .then(artists =>
      dispatch({
        type: 'loaded',
        itemType: 'artist',
        selectionPath,
        nodes: artists,
      })
    );

const loadAlbums = (artistName: string, selectionPath, dispatch) =>
  findAlbums(artistName)
    .then(albums => dispatch({
      type: 'loaded',
      itemType: 'album',
      selectionPath,
      nodes: albums,
    }));

const loadTracks = (artistName: string, albumName: string, selectionPath, dispatch) =>
  findTracks(artistName, albumName)
    .then(albumDetails => dispatch({
      type: 'loaded',
      itemType: 'track',
      selectionPath,
      nodes: albumDetails.tracks,
    }));

const loadSubnodesFor = (selectedNode, selectionPath, dispatch) => {
  const loaders = {
    'similar_artist': () => loadSimilar(selectedNode.get('artistName'), selectionPath, dispatch),
    'artist': () => loadAlbums(selectedNode.get('artistName'), selectionPath, dispatch),
    'album': () => loadTracks(selectedNode.get('artistName'), selectedNode.get('albumName'), selectionPath, dispatch),
  };
  const action = loaders[selectedNode.get('type')];
  if (action) {
    dispatch(markNodeAsLoading(selectionPath));
    return action()
      .then(() => dispatch(markNodeAsLoaded(selectionPath)));
  }
};

const handleMoveRight = (selectionPath, selectedNode, dispatch) => {
  if (selectedNode.get('child') && !selectedNode.get('isHidden')) {
    dispatch({type: 'move_selection_right'});
  } else if (selectedNode.get('child') && selectedNode.get('isHidden')) {
    dispatch(show());
  } else {
    return loadSubnodesFor(selectedNode, selectionPath, dispatch);
  }
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
    (loadSubnodesFor(previousNode, previousNodePath, dispatch) as any)
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
