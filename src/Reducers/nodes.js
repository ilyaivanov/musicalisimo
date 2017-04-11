import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import flattenDeep from 'lodash/flattenDeep';

import lastfmReducer from './lasftfmReducer';
const initialNodes = [];

export function getFlattenList(nodes) {
  const maper = node => (node.child && !node.isHidden) ? [node, node.child.map(maper)] : [node];
  return flattenDeep(nodes.map(maper));
}

export function getSelectedNodeIndex(flattenNodes) {
  return findIndex(flattenNodes, n => n.isSelected);
}

const moveDown = (flattenNodes, selectedIndex) => {
  flattenNodes[selectedIndex].isSelected = false;
  flattenNodes[selectedIndex + 1].isSelected = true;
};

const moveUp = (flattenNodes, selectedIndex) => {
  flattenNodes[selectedIndex].isSelected = false;
  flattenNodes[selectedIndex - 1].isSelected = true;
};

const moveToParent = (flattenNodes, selectedIndex) => {
  const parentIndex = findIndex(
    flattenNodes,
    node => node.child && node.child.indexOf(flattenNodes[selectedIndex]) >= 0
  );
  if (parentIndex >= 0){
    flattenNodes[selectedIndex].isSelected = false;
    flattenNodes[parentIndex].isSelected = true;
  }
};

export default function reducer(allNodes = initialNodes, action) {
  const copy = cloneDeep(allNodes);
  const flattenNodes = getFlattenList(copy);

  const nodes = lastfmReducer(copy, flattenNodes, action);

  const selectedIndex = getSelectedNodeIndex(flattenNodes);

  if (action.type.startsWith('move') &&
    selectedIndex === -1 &&
    nodes &&
    nodes.length > 0) {
    nodes[0].isSelected = true;
    return nodes;
  }

  if (action.type === 'move_down' &&
    selectedIndex < flattenNodes.length - 1) {
    moveDown(flattenNodes, selectedIndex);
    return nodes;
  }
  if (action.type === 'move_up' &&
    selectedIndex > 0) {
    moveUp(flattenNodes, selectedIndex);
    return nodes;
  }

  if (action.type === 'move_right' &&
    selectedIndex >= 0) {
    if (flattenNodes[selectedIndex].child && flattenNodes[selectedIndex].isHidden) {
      flattenNodes[selectedIndex].isHidden = false;
    } else if (flattenNodes[selectedIndex].child) {
      moveDown(flattenNodes, selectedIndex);
    }
    else {
      flattenNodes[selectedIndex].isLoading = true;
    }
    return nodes;
  }

  if (action.type === 'move_left' &&
    selectedIndex >= 0) {
    if (!flattenNodes[selectedIndex].isHidden && flattenNodes[selectedIndex].child) {
      flattenNodes[selectedIndex].isHidden = true;
    } else if (selectedIndex > 0) {
      moveToParent(flattenNodes, selectedIndex);
    }
    return nodes;
  }


  return nodes;
}

