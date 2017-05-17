// new events
import { createSelectedPath } from '../../Reducers/nodes.traversal';
export const moveDown = () =>
  ({ type: 'move_selection_down' });

export const moveUp = () =>
  ({ type: 'move_selection_up' });

export const moveLeft = () => (dispatch, getState) => {
  const selectionPath = createSelectedPath(getState().favorites.nodes);
  const selectedNode = getState().favorites.nodes.getIn(selectionPath);
  if (selectedNode.get('isHidden') || !selectedNode.get('child'))
    dispatch({ type: 'move_selection_left' });
  else
    dispatch({ type: 'hide', selectionPath });
};

export const moveRight = () => (dispatch, getState) => {
  const selectionPath = createSelectedPath(getState().favorites.nodes);
  const selectedNode = getState().favorites.nodes.getIn(selectionPath);
  if (!selectedNode.get('isHidden') || !selectedNode.get('child'))
    dispatch({ type: 'move_selection_right' });
  else
    dispatch({ type: 'show', selectionPath });
};

