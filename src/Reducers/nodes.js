import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import flattenDeep from 'lodash/flattenDeep';
import { v4 } from 'uuid';
import { lookForAlbums } from "./actions";
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
const mapItem = item => ({
  id: v4(),
  text: item.name,
});
export default function reducer(allNodes = initialNodes, action) {
  if (action.type === 'search_done') {
    return action.artists.map(ar => ({
      ...mapItem(ar),
      onOpen: function () {
        return lookForAlbums(ar.name, this.id)
      },
    }));
  }


  const nodes = cloneDeep(allNodes);
  const flattenNodes = getFlattenList(nodes);
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
      moveUp(flattenNodes, selectedIndex);
    }
    return nodes;
  }

  if (action.type === 'loaded') {
    console.log('loaded', action);
    const loadedParent = flattenNodes.find(node => node.id === action.id);
    loadedParent.isLoading = false;
    loadedParent.child = action.items.map(mapItem);
    return nodes;
  }

  return nodes;
}

