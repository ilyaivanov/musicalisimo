import nodesReducer from './nodes';

export const favoritesInitialState = {
  nodes: [],
  isFocused: false
};
export default function reducer(state = favoritesInitialState, action) {
  if (action.type === 'add_to_favorites') {
    return {
      ...state,
      nodes: state.nodes.concat(action.item)
    };
  }

  if (action.type.startsWith('focus')) {
    return {
      ...state,
      isFocused: action.type === 'focus_favorites'
    }
  }

  if (state.isFocused) {
    return {
      ...state,
      nodes: nodesReducer(state.nodes, action),
    };
  }
  return state;
}