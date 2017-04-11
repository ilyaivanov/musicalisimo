import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import flattenDeep from 'lodash/flattenDeep';
import { v4 } from 'uuid';
import { lookForAlbums, lookForTracks } from "./actions";
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
  duration: item.duration,
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

  const specialNode = () => ({
    id: v4,
    text: 'Similar',
    isSpecial: true,
  });
  if (action.type === 'loaded') {
    const target = flattenNodes.find(node => node.id === action.id);
    target.isLoading = false;

    const items = action.items.map(item => ({
      ...mapItem(item),
      onOpen: function () {
        return lookForTracks(target.text, item.name, this.id)
      }
    }));
    const childs = action.itemType === 'albums' ?
      [specialNode()].concat(items) :
      items;

    target.child = childs;
    return nodes;
  }


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


  return nodes;
}

