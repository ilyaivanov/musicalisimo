// new events
import {createSelectedPath} from '../../Reducers/nodes.traversal';
import {findAlbums, findSimilar, findTopTracks, findTracks} from '../../services/lastfm';
import {AppState, GetState, Path, YoutubeResult} from '../../types';
import {Dispatch} from 'react-redux';
import {getPreviousNodePath} from '../../Reducers/nodes.movement';
import {dismissSearch} from '../NodesFilter/actions';
import {filterEnabled} from '../../featureFlags';
import {playTrack} from '../../Player/actions';

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

const createSelectionPathFromState = (getState: GetState, criteria?) =>
  createSelectedPath(getSelectedTab(getState()).nodes, criteria);

const createPathById = (id: string, getState: GetState) =>
  createSelectionPathFromState(getState, n => n.get('id') === id);

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

export const showNodeById = (id: string) => (dispatch: Dispatch<any>, getState: GetState) => {
  let selectionPath = createSelectionPathFromState(getState, n => n.get('id') === id);
  let node = getSelectedTab(getState()).nodes.getIn(selectionPath);
  if (node.get('child')) {
    dispatch({
      type: 'show',
      selectionPath: selectionPath,
    });
  } else {
    loadSubnodesFor(node, selectionPath, dispatch);
  }
};

export const hideNodeById = (id: string) => (dispatch: Dispatch<any>, getState: GetState) => {
  dispatch({
    type: 'hide',
    selectionPath: createPathById(id, getState),
  });
};

export const show = () => selectionAction('show');
export const hide = () => selectionAction('hide');

export const startEditNode = () => selectionAction('start_edit_node');
export const stopEditNode = () => selectionAction('stop_edit_node');
export const updateNodeText = (text) => selectionAction('update_node_text', {text});

export const addPlaylist = () => selectionAction('add_playlist');

function removeExistingContext(getState: GetState, dispatch: Dispatch<any>) {
  const contextPath = createContextPath(getState);
  if (contextPath.length > 0) {
    dispatch(removeContext());
  }
}
export const createContext = () => (dispatch: Dispatch<any>, getState: GetState) => {
  removeExistingContext(getState, dispatch);
  dispatch(show());
  dispatch(selectionAction('create_context'));
  dispatch(moveDown());
};
export const onNodeIconClick = (id: string) => (dispatch: Dispatch<any>, getState: GetState) => {
  let selectionPath = createSelectionPathFromState(getState, n => n.get('id') === id);
  let node = getSelectedTab(getState()).nodes.getIn(selectionPath);
  if (node.get('type') === 'track') {
    playTrack(dispatch, node, createSelectedPath(getSelectedTab(getState()).nodes, 'isPlaying'), selectionPath);
  } else {
    dispatch(onSetContext(id));
  }
};

export const onSetContext = (id: string) => (dispatch: Dispatch<any>, getState: GetState) => {
  removeExistingContext(getState, dispatch);
  // TODO: if no child - load subchild
  dispatch({
    type: 'create_context',
    selectionPath: createPathById(id, getState),
  });
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
const loadTopTracks = (artistName: string, selectionPath, dispatch) =>
  findTopTracks(artistName)
    .then(tracks =>
      dispatch({
        type: 'loaded',
        itemType: 'track',
        selectionPath,
        albumDetails: {tracks},
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
      albumDetails,
    }));

const loadSubnodesFor = (selectedNode, selectionPath, dispatch) => {
  const loaders = {
    'similar_artist': () => loadSimilar(selectedNode.get('artistName'), selectionPath, dispatch),
    'artist_top_tracks': () => loadTopTracks(selectedNode.get('artistName'), selectionPath, dispatch),
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

export const refreshSelectedNode = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);

  return loadSubnodesFor(selectedNode, selectionPath, dispatch);
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
export const youtubeLoaded = (videos: YoutubeResult[]) => (dispatch: Dispatch<any>) => {
  dispatch({type: 'youtube_search_done', videos});
};

export const toggleYoutube = () => ({type: 'toggle_youtube'});
export const toggleShortcuts = () => ({type: 'toggle_shortcuts'});
export const toggleCleanView = () => ({type: 'toggle_clean_view'});

export const selectSearch = () => ({type: 'select_search'});
export const selectFavorites = () => ({type: 'select_favorites'});
export const selectSearchTerm = () => (dispatch: Dispatch<any>) => {
  dispatch({
    type: 'select_search_term'
  });
  setTimeout(() =>
    dispatch({
      type: 'select_search_term'
    })
  );
};

export const handleEnter = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const editNodePath = createSelectionPathFromState(getState, 'isEditing');
  console.log(editNodePath);
  if (editNodePath.length > 0) {
    dispatch(stopEditNode());
  } else {
    dispatch(addPlaylist());
  }
};

export const dismissOnBody = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const filter = getState().filter;
  if (filter && filter.length > 0 && filterEnabled) {
    dispatch(dismissSearch());
  } else {
    dispatch(removeContext());
    dispatch(stopEditNode());
  }
};