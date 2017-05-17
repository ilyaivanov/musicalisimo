import nodesReducer from './nodes.traversal';
import hideNodesReducer from './nodes.hide';

export const favoritesInitialState = {
  nodes: [],
  isFocused: false
};
export default function reducer(state = favoritesInitialState, action) {
  return {
    ...state,
    nodes: hideNodesReducer(nodesReducer(state.nodes, action), action),
  };
}