import nodesReducer from './nodes';

const searchResults = {
  nodes: [],
  isFocused: false
};
export default function reducer(state = searchResults, action) {
  if (action.type.startsWith('focus')) {
    return {
      ...state,
      isFocused: action.type === 'focus_search'
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