import {Dispatch} from 'react-redux';
import { getSelectedTab } from '../Containers/InputHandler/actions';
import { createSelectedPath, getNextNodePath } from '../Reducers/nodes.traversal';
import findYoutubeVideo from '../services/youtube';
import {GetState, Path} from '../types';

const playTrack = (dispatch: Dispatch<any>, selectedNode: any, currentTrackPath: Path, trackToPlayPath: Path) => {
  if (selectedNode.get('trackName')) {
    dispatch({ type: 'play', node: selectedNode,  currentTrackPath, trackToPlayPath});
    findYoutubeVideo(selectedNode.get('artistName'), selectedNode.get('trackName'))
      .then(video => dispatch({ type: 'play_loaded', video }));
  }
};

export const play = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const currentlyPlayingTrackPath = createSelectedPath(selectedTab.nodes, 'isPlaying');
  const trackToPlayPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(trackToPlayPath);
  playTrack(dispatch, selectedNode, currentlyPlayingTrackPath, trackToPlayPath);
};

export const playNextTrack = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const currentlyPlayingTrackPath = createSelectedPath(selectedTab.nodes, 'isPlaying');
  const trackToPlayPath = getNextNodePath(currentlyPlayingTrackPath, selectedTab.nodes);
  const nextNode = selectedTab.nodes.getIn(trackToPlayPath);
  playTrack(dispatch, nextNode, currentlyPlayingTrackPath, trackToPlayPath);
};