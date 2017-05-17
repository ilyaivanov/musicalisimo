import nodesReducer from './nodes.new';

export const favoritesInitialState = {
  nodes: [],
  isFocused: false
};
export default function reducer(state = favoritesInitialState, action) {
  return {
    ...state,
    nodes: nodesReducer(state.nodes, action),
  };
}