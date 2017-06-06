import {Dispatch} from 'redux';
import {GetState} from "../types";
import {getSelectedTab} from "./InputHandler/actions";
import {createSelectedPath} from "../Reducers/nodes.traversal";

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

export const updateNodeText = (text) => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);

  dispatch({
    text,
    selectionPath,
    type: 'update_node_text',
  });
};

