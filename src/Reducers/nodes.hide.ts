import {hideNode, loadedNode, loadingNode, playNode, showNode, unplayNode} from './mutators';

export default function reducer(rootNodes: any = [], action: any) {
  if (action.type === 'hide') {
    return rootNodes.updateIn(action.selectionPath, hideNode);
  }

  if (action.type === 'show') {
    return rootNodes.updateIn(action.selectionPath, showNode);
  }

  if (action.type === 'play') {
    const temp = action.currentTrackPath.length > 0 ?
      rootNodes.updateIn(action.currentTrackPath, unplayNode) :
      rootNodes;
    return temp.updateIn(action.trackToPlayPath, playNode);
  }

  if (action.type === 'delete_node') {
    return rootNodes.deleteIn(action.selectionPath);
  }

  if (action.type === 'node_started_loading') {
    return rootNodes.updateIn(action.selectionPath, loadingNode);
  }

  if (action.type === 'node_finished_loading') {
    return rootNodes.updateIn(action.selectionPath, loadedNode);
  }

  return rootNodes;
}