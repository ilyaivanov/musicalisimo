import {v4} from 'uuid';
import {fromJS} from 'immutable';
import {
  createContextFromNode,
  hideNode,
  insertItemInto,
  loadedNode,
  loadingNode,
  playNode, removeContextFromNode, setNodeText,
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

  const actionMutators = {
    hide: hideNode,
    show: showNode,
    node_started_loading: loadingNode,
    node_finished_loading: loadedNode,
    start_edit_node: startEditingNode,
    stop_edit_node: stopEditingNode,
    create_context: createContextFromNode,
    remove_context: removeContextFromNode,
  };

  const mutator = actionMutators[action.type];
  if (mutator) {
    return rootNodes.updateIn(action.selectionPath, mutator);
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

  if (action.type === 'add_playlist') {
    return insertItemInto(rootNodes, action.selectionPath, fromJS(createPlaylistNode()));
  }

  if (action.type === 'update_node_text') {
    return rootNodes.updateIn(action.selectionPath, n => setNodeText(n, action.text));
  }

  return rootNodes;
}