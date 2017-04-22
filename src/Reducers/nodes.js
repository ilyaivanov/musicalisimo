import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import flattenDeep from 'lodash/flattenDeep';

import lastfmReducer from './lasftfmReducer';
const initialNodes = [];

export function getFlattenList(nodes) {
  const maper = node => (node.child && !node.isHidden) ? [node, node.child.map(maper)] : [node];
  return flattenDeep(nodes.map(maper));
}

const getParentIndex = (flattenNodes, childIndex) =>
  findIndex(
    flattenNodes,
    node => node.child && node.child.indexOf(flattenNodes[childIndex]) >= 0
  );


export function getSelectedNodeIndex(flattenNodes) {
  return findIndex(flattenNodes, n => n.isSelected);
}

const swap = (array, index1, index2) => {
  const tmp = array[index1];
  array[index1] = array[index2];
  array[index2] = tmp;
  return array;
};

const getNodesContext = (flattenNodes, selectedIndex) => {
  const parentIndex = getParentIndex(flattenNodes, selectedIndex);
  return (parentIndex === -1) ? flattenNodes : flattenNodes[parentIndex].child;
};

const moveDown = (flattenNodes, selectedIndex) => {
  flattenNodes[selectedIndex].isSelected = false;
  flattenNodes[selectedIndex + 1].isSelected = true;
};

const moveUp = (flattenNodes, selectedIndex) => {
  flattenNodes[selectedIndex].isSelected = false;
  flattenNodes[selectedIndex - 1].isSelected = true;
};

const moveToParent = (flattenNodes, selectedIndex) => {
  const parentIndex = getParentIndex(flattenNodes, selectedIndex);
  if (parentIndex >= 0) {
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

  // right now all ndoes are treated equal
  if (action.type === 'delete_selected' &&
    selectedIndex > -1) {
    const parentIndex = getParentIndex(flattenNodes, selectedIndex);
    // root case
    if (parentIndex === -1) {
      nodes.splice(selectedIndex, 1);
      if (selectedIndex > 0)
        moveUp(flattenNodes, selectedIndex);
    } else {
      const selectedSubnodeIndex = getSelectedNodeIndex(flattenNodes[parentIndex].child);
      if (selectedIndex > 0)
        moveUp(flattenNodes, selectedIndex);
      flattenNodes[parentIndex].child.splice(selectedSubnodeIndex, 1);
    }
    return nodes;
  }
  if (action.type === 'move_down' &&
    selectedIndex < flattenNodes.length - 1) {
    moveDown(flattenNodes, selectedIndex);
    return nodes;
  }
  if (action.type === 'move_node_down' &&
    selectedIndex < flattenNodes.length - 1) {
    const nodesContext = getNodesContext(flattenNodes, selectedIndex);
    return swap(nodesContext, selectedIndex, selectedIndex + 1);
  }
  if (action.type === 'move_up' &&
    selectedIndex > 0) {
    moveUp(flattenNodes, selectedIndex);
    return nodes;
  }

  if (action.type === 'move_node_up' &&
    selectedIndex > 0) {
    const nodesContext = getNodesContext(flattenNodes, selectedIndex);
    return swap(nodesContext, selectedIndex, selectedIndex - 1);
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

