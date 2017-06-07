export interface UserConfiguration {
  youtubeVisible: boolean;
  shortcutsVisible: boolean;
}

const defaultState = {
  youtubeVisible: true,
  shortcutsVisible: true,
};

export default function reducer(state: UserConfiguration = defaultState, action: any) {
  if (action.type === 'toggle_youtube') {
    return {
      ...state,
      youtubeVisible: !state.youtubeVisible,
    };
  }
  if (action.type === 'toggle_shortcuts') {
    return {
      ...state,
      shortcutsVisible: !state.shortcutsVisible,
    };
  }
  return state;
}