import { fromJS } from 'immutable';

const pathOrDefault = (path, defaultPath) =>
  path.length > 0 ? path : defaultPath;

const rec = (nodes, path, propName) => {
  if (!nodes || nodes.size === 0)
    return;

  for (let i = 0; i < nodes.size; i++) {
    if (nodes.get(i).get(propName)) {
      return path.concat([i])
    }
    const res = rec(nodes.get(i).get('child'), path.concat([i, 'child']), propName);

    if (res)
      return res;
  }
};

export const createSelectedPath = (nodes, propName = 'isSelected') => {
  return rec(nodes, [], propName) || [];
};

const getDownPath = (path, nodes) => {
  if (path.length === 0)
    return path;

  const up = path.slice(0, path.length - 1);
  const root = nodes.getIn(up);
  if (root && (path[path.length - 1] < root.size - 1)) {
    return fromJS(path).update(path.length - 1, v => v + 1).toJS();
  }
  return getDownPath(up.slice(0, up.length - 1), nodes);
};

export const getNextNodePath = (path, nodes) => {
  const node = nodes.getIn(path);
  const child = node.get('child');
  if (child && child.size > 0 && !node.get('isHidden'))
    return path.concat(['child', 0]);

  return pathOrDefault(getDownPath(path, nodes), path);
};

const getUpPath = (path, nodes) => {
  if (path[path.length - 1] > 0) {
    let up = fromJS(path).update(path.length - 1, v => v - 1).toJS();
    while (nodes.getIn(up).get('child') && nodes.getIn(up).get('child').size > 0) {
      if (nodes.getIn(up).get('isHidden'))
        return up;

      up = up.concat(['child', nodes.getIn(up).get('child').size - 1])
    }
    return up;
  }
  return path.slice(0, path.length - 2);
};

export const getUpUp = (path, nodes) =>
  pathOrDefault(getUpPath(path, nodes), path);

export const getLeftPath = (path, nodes) =>
  pathOrDefault(path.slice(0, path.length - 2), path);

export const getRightPath = (path, nodes) => {
  return getNextNodePath(path, nodes);
};


export const moveSelection = (nodes, toPath) => {
  const path = createSelectedPath(nodes);
  if (path.length === 0)
    return nodes.updateIn([0], node => node.merge({ isSelected: true }));
  return nodes
    .updateIn(path, x => x.delete('isSelected'))
    .updateIn(toPath, node => node.merge({ isSelected: true }));
};

export default function reducer(rootNodes = [], action) {
  const actions = {
    'move_selection_down': () => moveSelection(rootNodes, getNextNodePath(createSelectedPath(rootNodes), rootNodes)),
    'move_selection_up': () => moveSelection(rootNodes, getUpUp(createSelectedPath(rootNodes), rootNodes)),
    'move_selection_left': () => moveSelection(rootNodes, getLeftPath(createSelectedPath(rootNodes), rootNodes)),
    'move_selection_right': () => moveSelection(rootNodes, getRightPath(createSelectedPath(rootNodes), rootNodes)),
  };

  if (actions[action.type])
    return actions[action.type]();

  return rootNodes;
}