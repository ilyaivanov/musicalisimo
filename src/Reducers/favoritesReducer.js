import nodesReducer from './nodes.traversal';
import hideNodesReducer from './nodes.hide';
import lasftfmReducer from './lasftfmReducer';

export const favoritesInitialState = {
  nodes: [],
  isFocused: false
};
export default function reducer(state = favoritesInitialState, action) {
  return {
    ...state,
    nodes: lasftfmReducer(hideNodesReducer(nodesReducer(state.nodes, action), action), action),
  };
}