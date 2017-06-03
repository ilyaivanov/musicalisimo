import {Dispatch} from 'redux';

export const artistLoaded = (artists: any) => (dispatch: Dispatch<any>) => {
  dispatch({type: 'search_done', artists});
};

export const selectSearch = () => ({
  type: 'select_search'
});

export const selectFavorites = () => ({
  type: 'select_favorites'
});
export const selectSearchTerm = () => ({
  type: 'select_search_term'
});

