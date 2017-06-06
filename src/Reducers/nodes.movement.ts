import * as _ from 'lodash';
import {createSelectedPath} from './nodes.traversal';
import * as Immutable from 'immutable';
import {fromJS} from 'immutable';
import {Action, MNode, Path} from '../types';
import {showNode} from './mutators';

const swap = (nodes: Immutable.List<MNode>, leftPath: Path, rightPath: Path) => {
  const leftNode = nodes.getIn(leftPath);
  const rightNode = nodes.getIn(rightPath);
  return nodes
    .setIn(leftPath, rightNode)
    .setIn(rightPath, leftNode);
};

export const remove = (path: {}[], numberOfItems: number) =>
  path.slice(0, path.length - numberOfItems);

function updateArrayAt<T>(array: T[], index: number, updater: (t: T) => T): T[] {
  return fromJS(array)
    .update(index, updater)
    .toJS();
}

export const getPreviousNodePath = (path: Path): Path =>
  updateArrayAt(
    path,
    path.length - 1,
    v => +v - 1);

const updateSelectedNodeBy =
  (rootNodes: Immutable.List<MNode>, updaterInSelectionPath: (v: number | string) => number | string) => {
    const selectionPath = createSelectedPath(rootNodes);
    const nextNode = updateArrayAt(
      selectionPath,
      selectionPath.length - 1,
      updaterInSelectionPath);

    if (rootNodes.getIn(nextNode) && nextNode[nextNode.length - 1] >= 0) {
      return swap(rootNodes, selectionPath, nextNode);
    } else {
      return rootNodes;
    }
  };

export default function reducer(rootNodes: Immutable.List<MNode> = fromJS([]), action: Action) {
  if (action.type === 'swap_selection_down') {
    return updateSelectedNodeBy(rootNodes, v => +v + 1);
  }
  if (action.type === 'swap_selection_up') {
    return updateSelectedNodeBy(rootNodes, v => +v - 1);
  }
  if (action.type === 'swap_selection_right') {
    const selectionPath = createSelectedPath(rootNodes);
    const previousNodePath = getPreviousNodePath(selectionPath);

    const lastItem = _.last(previousNodePath);
    const last = _.isUndefined(lastItem) ? -1 : lastItem;
    if (rootNodes.getIn(previousNodePath) && (last >= 0)) {
      const n = rootNodes.getIn(selectionPath);
      return rootNodes
        .deleteIn(selectionPath)
        .updateIn(previousNodePath, node => node.set('child', node.get('child').concat([n])))
        .updateIn(previousNodePath, showNode);
    }
  }
  if (action.type === 'swap_selection_left') {
    const selectionPath = createSelectedPath(rootNodes);
    if (selectionPath.length > 1) {
      const n = rootNodes.getIn(selectionPath);
      const lastItem = _.last(remove(selectionPath, 2));
      const last = _.isUndefined(lastItem) ? -1 : +lastItem;
      const parentContextPath = remove(selectionPath, 3);

      return rootNodes
        .deleteIn(selectionPath)
        .updateIn(parentContextPath, nodes => nodes.insert(last + 1, n));

    }
  }
  return rootNodes;
}