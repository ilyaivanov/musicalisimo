import {UserSettings} from '../types';

const defaultState = {
  youtubeVisible: true,
  shortcutsVisible: true,
  isCleanView: false,
};

export default function reducer(state: UserSettings= defaultState, action: any) {
  if (action.type === 'toggle_youtube') {
    return {
      ...state,
      youtubeVisible: !state.youtubeVisible,
    };
  }
  if (action.type === 'toggle_clean_view') {
    return {
      ...state,
      isCleanView: !state.isCleanView,
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