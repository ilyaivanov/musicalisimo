export const artistLoaded = (artists) => (dispatch) => {
  dispatch({ type: 'search_done', artists });
};

