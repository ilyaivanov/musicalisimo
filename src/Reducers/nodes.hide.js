import { hideNode, playNode, showNode, unplayNode } from "./mutators";
export default function reducer(rootNodes = [], action) {
  if (action.type === 'hide')
    return rootNodes.updateIn(action.selectionPath, hideNode);

  if (action.type === 'show')
    return rootNodes.updateIn(action.selectionPath, showNode);

  if (action.type === 'play') {
    const temp = action.currentTrackPath.length > 0 ? rootNodes.updateIn(action.currentTrackPath, unplayNode) : rootNodes;
    return temp.updateIn(action.trackToPlayPath, playNode);
  }

  return rootNodes;
}