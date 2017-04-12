const defaultState = {
  track: 'YAAAHOOO!!!!!'
};

export default function (state = defaultState, action) {
  console.log('Player', action);
  return state;
}