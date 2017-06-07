import * as Immutable from 'immutable';
import {fromJS} from 'immutable';
import {v4} from 'uuid';
import nodesReducer, {createSelectedPath} from './nodes.traversal';
import hideNodesReducer from './nodes.hide';
import moveNodeReducer from './nodes.movement';
import lasftfmReducer, {mapArtist, mapYoutubeItem} from './lasftfmReducer';
import {updateIds} from './mutators';

import {MNode} from '../types';

export const initialState = {
  nodes: fromJS([]),
  isFocused: false
};
interface State {
  nodes: Immutable.List<MNode>;
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
export const defaultSearchNodes = () => ([
  {text: 'lastfm', type: 'lastfm_results', id: v4()},
  {text: 'youtube', type: 'youtube_results', id: v4()},
]);
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
      nodes: state.nodes.updateIn([0], n => n.merge({child: fromJS(action.artists.map(mapArtist))})),
    };
  }
  if (action.type === 'youtube_search_done') {
    return {
      ...state,
      nodes: state.nodes.updateIn([1], n => n.merge({child: fromJS(action.videos.map(mapYoutubeItem))})),
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
      : state.nodes.push(newNode as any);
    return {
      ...state,
      nodes: newNodes,
    };
  }
  return reducer(state, action);
};