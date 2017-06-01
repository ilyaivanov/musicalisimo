import { getSelectedTab } from "../Containers/InputHandler/actions";
import { createSelectedPath } from "../Reducers/nodes.traversal";
import findYoutubeVideo from '../services/youtube';

export const play = () => (dispatch, getState) => {
  const selectedTab = getSelectedTab(getState());
  const selectionPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(selectionPath);
  if (selectedNode.get('trackName')) {
    dispatch({ type: 'play', node: selectedNode });
    findYoutubeVideo(selectedNode.get('artistName'), selectedNode.get('trackName'))
      .then(video => dispatch({ type: 'play_loaded', video }));
  }
};