import { v4 } from "uuid";
import findYoutubeVideo from '../services/youtube'
import { getSelectedNode } from "./actions";

export const addSelectedItemToQueue = () => (dispatch, getState) => {
  const selectedNode = getSelectedNode(getState);

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