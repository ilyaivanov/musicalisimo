import nodesReducer from './nodes';
import { v4 } from "uuid";

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

  if (action.type === 'create_playlist') {
    return {
      ...state,
      nodes: state.nodes.concat({
        id: v4(),
        isSpecial: true,
        text: 'New Playlist',
        type: 'playlist',
        child: [],
      })
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