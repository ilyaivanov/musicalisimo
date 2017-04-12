import { v4 } from "uuid";
import findYoutubeVideo from '../services/youtube'
import { getFlattenList, getSelectedNodeIndex } from "./nodes";

export const addSelectedItemToQueue = () => (dispatch, getState) => {
  let nodes = getFlattenList(getState().nodes);
  const selectedIndex = getSelectedNodeIndex(nodes);
  const selectedNode = nodes[selectedIndex];
  if (selectedNode.artistName) {
    const { artistName, albumName, trackName } = selectedNode;
    const queueItemId = v4();
    dispatch({ type: 'addToQueue', artistName, albumName, trackName, id: queueItemId });

    let promise;
    if (trackName)
      promise = findYoutubeVideo(artistName, trackName);
    else
      promise = findYoutubeVideo(artistName, albumName);

    promise.then(youtubeItem => dispatch({
      type: 'loadedYoutubeVideo',
      id: queueItemId,
      youtubeId: youtubeItem.id
    }));
  }
};