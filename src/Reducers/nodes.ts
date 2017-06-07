import {fromJS} from 'immutable';

import nodesReducer, {createSelectedPath} from './nodes.traversal';
import hideNodesReducer from './nodes.hide';
import moveNodeReducer from './nodes.movement';
import lasftfmReducer, {mapArtist} from './lasftfmReducer';
import {updateIds} from './mutators';

export const initialState = {
  nodes: [],
  isFocused: false
};
interface State {
  nodes: any[];
  isFocused: boolean;
}
export default function reducer(state: State = initialState, action: any) {

  if (state.isFocused) {
    return {
      ...state,
      nodes: lasftfmReducer(
        moveNodeReducer(
          hideNodesReducer(
            nodesReducer(state.nodes as any, action),
            action),
          action),
        action),
    };
  } else {
    return state;
  }
}

export const searchReducer = (state: State, action: any) => {
  if (action.type === 'select_search_term') {
    return {
      ...state,
      isSearchFieldFocused: true,
      isFocused: true,
    };
  }
  if (action.type === 'select_search') {
    return {
      ...state,
      isFocused: true,
      isSearchFieldFocused: false,
    };
  }
  if (action.type.startsWith('select_')) {
    return {
      ...state,
      isSearchFieldFocused: false,
      isFocused: false,
    };
  }
  if (action.type === 'search_done') {
    return {
      ...state,
      nodes: fromJS(action.artists.map(mapArtist)),
    };
  }
  return reducer(state, action);
};

export const favoritesReducer = (state: State, action: any) => {
  if (action.type === 'select_favorites') {
    return {
      ...state,
      isFocused: true,
    };
  }
  if (action.type.startsWith('select_')) {
    return {
      ...state,
      isFocused: false,
    };
  }
  if (action.type === 'add_to_favorites') {
    // add node to child of (path)
    const contextNodePath = createSelectedPath(state.nodes as any, 'isContext');
    const contextPath = contextNodePath.concat(['child']);
    const newNode = updateIds(action.node.merge({isSelected: false}));
    const newNodes = contextNodePath.length > 0 ?
      (state
        .nodes as any)
        .updateIn(contextPath, nodes => nodes.push(newNode))
      : state.nodes.push(newNode);
    return {
      ...state,
      nodes: newNodes,
    };
  }
  return reducer(state, action);
};

