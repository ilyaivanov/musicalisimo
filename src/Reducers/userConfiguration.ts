export interface UserConfiguration {
  youtubeVisible: boolean;
}

const defaultState = {
  youtubeVisible: true,
};

export default function reducer(state: UserConfiguration = defaultState, action: any) {
  if (action.type === 'toggle_youtube') {
    return {
      ...state,
      youtubeVisible: !state.youtubeVisible,
    };
  }
  return state;
}