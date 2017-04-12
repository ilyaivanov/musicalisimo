import cloneDeep from "lodash/cloneDeep";
import { v4 } from "uuid";
const defaultState = {
  queue: [],
  track: 'YAAAHOOO!!!!!'
};

export default function (state = defaultState, action) {
  if (action.type === 'addToQueue') {
    const newState = cloneDeep(state);
    const { artistName, albumName, trackName } = action;
    newState.queue.push({ artistName, albumName, trackName, id: v4() });
    return newState;
  }

  return state;
}