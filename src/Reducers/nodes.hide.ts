import {v4} from 'uuid';
import {fromJS} from 'immutable';
import {
  hideNode,
  insertItemInto,
  loadedNode,
  loadingNode,
  playNode, setNodeText,
  showNode, startEditingNode, stopEditingNode,
  unplayNode,
} from './mutators';

const createPlaylistNode = () => ({
  id: v4(),
  type: 'playlist',
  text: 'Playlist',
  child: [],
});

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

  if (action.type === 'add_playlist') {
    return insertItemInto(rootNodes, action.selectionPath, fromJS(createPlaylistNode()));
  }

  if (action.type === 'start_edit_node') {
    return rootNodes.updateIn(action.selectionPath, startEditingNode);
  }

  if (action.type === 'update_node_text') {
    return rootNodes.updateIn(action.selectionPath, n => setNodeText(n, action.text));
  }

  if (action.type === 'stop_edit_node') {
    return rootNodes.updateIn(action.selectionPath, stopEditingNode);
  }

  return rootNodes;
}