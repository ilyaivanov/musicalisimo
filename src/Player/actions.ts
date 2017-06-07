import {Dispatch} from 'react-redux';
import {getSelectedTab} from '../Containers/InputHandler/actions';
import {createSelectedPath, getNextNodePath} from '../Reducers/nodes.traversal';
import {findYoutubeVideo} from '../services/youtube';
import {GetState, Path} from '../types';

const playTrack = (dispatch: Dispatch<any>, selectedNode: any, currentTrackPath: Path, trackToPlayPath: Path) => {
  if (selectedNode.get('trackName')) {
    dispatch({type: 'play', node: selectedNode, currentTrackPath, trackToPlayPath});
    findYoutubeVideo(selectedNode.get('artistName'), selectedNode.get('trackName'))
      .then(video => dispatch({type: 'play_loaded', video}));
  }
  if (selectedNode.get('type') === 'youtube_video') {
    const video = {
      id: selectedNode.get('youtubeId'),
      title: selectedNode.get('youtubeTitle')
    };
    dispatch({type: 'play', node: selectedNode, currentTrackPath, trackToPlayPath});
    dispatch({type: 'play_loaded', video});
  }
};

export const getCurrentlyPlayingTrackPath = (nodes) =>
  createSelectedPath(nodes, n => n.get('isPlaying') && n.get('type') === 'track');

export const play = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const currentlyPlayingTrackPath = getCurrentlyPlayingTrackPath(selectedTab.nodes);
  const trackToPlayPath = createSelectedPath(selectedTab.nodes);
  const selectedNode = selectedTab.nodes.getIn(trackToPlayPath);
  playTrack(dispatch, selectedNode, currentlyPlayingTrackPath, trackToPlayPath);
};

export const playNextTrack = () => (dispatch: Dispatch<any>, getState: GetState) => {
  const selectedTab = getSelectedTab(getState());
  const currentlyPlayingTrackPath = getCurrentlyPlayingTrackPath(selectedTab.nodes);
  const trackToPlayPath = getNextNodePath(currentlyPlayingTrackPath, selectedTab.nodes);
  const nextNode = selectedTab.nodes.getIn(trackToPlayPath);
  playTrack(dispatch, nextNode, currentlyPlayingTrackPath, trackToPlayPath);
};