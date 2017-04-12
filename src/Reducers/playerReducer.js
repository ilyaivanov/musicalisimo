import cloneDeep from "lodash/cloneDeep";
const defaultState = {
  queue: [],
};

export default function (state = defaultState, action) {
  if (action.type === 'addToQueue') {
    const newState = cloneDeep(state);
    const { artistName, albumName, trackName } = action;
    newState.queue.push({ artistName, albumName, trackName, id: action.id });
    // handle isCurrent here
    return newState;
  }
  if(action.type === 'loadedYoutubeVideo'){
    const newState = cloneDeep(state);
    const queueItem = newState.queue.filter(i => i.id == action.id)[0]; // should be there if only user haven't deleted it
    queueItem.youtubeId = action.youtubeId;
    // handle isCurrent here
    return newState;
  }
  return state;
}