import { getFlattenList, getSelectedNodeIndex } from "./nodes";

let id = 10;

export const moveRight = () => (dispatch, getState) => {
  let nodes = getFlattenList(getState());
  const selectedIndex = getSelectedNodeIndex(nodes);
  const selectedNode = nodes[selectedIndex];

  dispatch({ type: 'move_right' });

  if(!selectedNode.child){
    setTimeout(() => dispatch({
      type: 'loaded',
      id: selectedNode.id ,
      items: [{ id: id++, text: 'new node' }, { id: id++, text: 'new node' }]
    }), 500);
  }

};