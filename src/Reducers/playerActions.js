import { getFlattenList, getSelectedNodeIndex } from "./nodes";

export const addSelectedItemToQueue = () => (dispatch, getState) => {
  let nodes = getFlattenList(getState().nodes);
  const selectedIndex = getSelectedNodeIndex(nodes);
  const selectedNode = nodes[selectedIndex];
  if(selectedNode.artistName)
    dispatch({ type: 'addToQueue', ...selectedNode });
};