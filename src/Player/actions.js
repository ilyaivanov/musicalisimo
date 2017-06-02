import { getSelectedTab } from "../Containers/InputHandler/actions";
import { createSelectedPath, getNextNodePath } from "../Reducers/nodes.traversal";
import findYoutubeVideo from '../services/youtube';

const playTrack = (dispatch, selectedNode, currentTrackPath, trackToPlayPath) => {
  if (selectedNode.get('trackName')) {
    dispatch({ type: 'play', node: selectedNode,  currentTrackPath, trackToPlayPath});
    findYoutubeVideo(selectedNode.get('artistName'), selectedNode.get('trackName'))
      .then(video => dispatch({ type: 'play_loaded', video }));
  }
};

export const play = () => (dispatch, getState) => {
  const selectedTab = getSelectedTab(getState());
  const currentlyPlayingTrackPath = createSelectedPath(selectedTab.nodes, 'isPlaying');
  const trackToPlayPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(trackToPlayPath);
  playTrack(dispatch, selectedNode, currentlyPlayingTrackPath, trackToPlayPath);
};

export const playNextTrack = () => (dispatch, getState) => {
  const selectedTab = getSelectedTab(getState());
  const currentlyPlayingTrackPath = createSelectedPath(selectedTab.nodes, 'isPlaying');
  const trackToPlayPath = getNextNodePath(currentlyPlayingTrackPath, selectedTab.nodes);
  const nextNode = selectedTab.nodes.getIn(trackToPlayPath);
  playTrack(dispatch, nextNode, currentlyPlayingTrackPath, trackToPlayPath);
};