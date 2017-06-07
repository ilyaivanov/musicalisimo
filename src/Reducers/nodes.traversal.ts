import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {fromJS} from 'immutable';

import {MNode, Path} from '../types';

const pathOrDefault = (path: Path, defaultPath: Path) =>
  path.length > 0 ? path : defaultPath;

export const firstArrayIncludesSecondFromStart = (arr1, arr2) => {
  const subset1 = arr1.slice(0, arr2.length);
  return _.isEqual(subset1, arr2);
};

const rec = (nodes: Immutable.List<MNode>, path: Path, filter: Function): Path | undefined => {
  if (!nodes || nodes.size === 0) {
    return undefined;
  }

  for (let i = 0; i < nodes.size; i++) {
    if (filter(nodes.get(i))) {
      return path.concat([i]);
    }
    const res = rec((nodes.get(i) as any).get('child'), path.concat([i, 'child']), filter);

    if (res) {
      return res;
    }
  }
  return undefined;
};

export const createSelectedPath = (nodes: Immutable.List<MNode>, criteria: string | Function = 'isSelected'): Path => {
  const filter = typeof criteria === 'string' ?
    (n => n.get(criteria)) :
    criteria;
  return rec(nodes, [], filter) || [];
};

const getDownPath = (path: Path, nodes: Immutable.List<MNode>): Path => {
  if (path.length === 0) {
    return path;
  }

  const up = path.slice(0, path.length - 1);
  const root = nodes.getIn(up);
  if (root && (path[path.length - 1] < root.size - 1)) {
    return fromJS(path).update(path.length - 1, (v: number) => v + 1).toJS();
  }
  return getDownPath(up.slice(0, up.length - 1), nodes);
};

export const getNextNodePath = (path: Path, nodes: Immutable.List<MNode>) => {
  const node = nodes.getIn(path);
  const child = node.get('child');
  if (child && child.size > 0 && !node.get('isHidden')) {
    return path.concat(['child', 0]);
  }

  return pathOrDefault(getDownPath(path, nodes), path);
};

const getUpPath = (path: Path, nodes: Immutable.List<MNode>) => {
  if (path[path.length - 1] > 0) {
    let up = fromJS(path).update(path.length - 1, (v: number) => v - 1).toJS();
    while (nodes.getIn(up).get('child') && nodes.getIn(up).get('child').size > 0) {
      if (nodes.getIn(up).get('isHidden')) {
        return up;
      }

      up = up.concat(['child', nodes.getIn(up).get('child').size - 1]);
    }
    return up;
  }
  return path.slice(0, path.length - 2);
};

export const getUpUp = (path: Path, nodes: Immutable.List<MNode>) =>
  pathOrDefault(getUpPath(path, nodes), path);

export const getLeftPath = (path: Path, nodes: Immutable.List<MNode>) =>
  pathOrDefault(path.slice(0, path.length - 2), path);

export const getRightPath = (path: Path, nodes: Immutable.List<MNode>) => {
  return getNextNodePath(path, nodes);
};

export const moveSelection = (nodes: Immutable.List<MNode>, toPath: Path) => {
  const path = createSelectedPath(nodes);
  const contextNodePath = createSelectedPath(nodes, 'isContext');
  const contextPath = contextNodePath.concat(['child']);
  if (contextNodePath.length > 0 && !firstArrayIncludesSecondFromStart(toPath, contextPath)) {
    return nodes;
  }
  if (path.length === 0) {
    return nodes.updateIn([0], (node: any) => node.merge({isSelected: true}));
  }
  return nodes
    .updateIn(path, (x: any) => x.delete('isSelected'))
    .updateIn(toPath, (node: any) => node.merge({isSelected: true}));
};

export default function reducer(rootNodes: Immutable.List<MNode> = fromJS([]), action: any) {
  const actions = {
    'move_selection_down': () => moveSelection(rootNodes, getNextNodePath(createSelectedPath(rootNodes), rootNodes)),
    'move_selection_up': () => moveSelection(rootNodes, getUpUp(createSelectedPath(rootNodes), rootNodes)),
    'move_selection_left': () => moveSelection(rootNodes, getLeftPath(createSelectedPath(rootNodes), rootNodes)),
    'move_selection_right': () => moveSelection(rootNodes, getRightPath(createSelectedPath(rootNodes), rootNodes)),
  };

  if (actions[action.type]) {
    return actions[action.type]();
  }

  return rootNodes;
}