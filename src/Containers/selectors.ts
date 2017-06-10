import {createSelectedPath} from '../Reducers/nodes.traversal';
import {Path} from '../types';

export const joinNamesForPath = (nodes, path: Path) => {
  const res: any[] = [];
  for (let i = 1; i < path.length; i += 2) {
    let subPath = path.slice(0, i);
    let node = nodes.getIn(subPath);
    res.push(node.get('text'));
  }
  let node = nodes.getIn(path);
  res.push(node.get('text'));
  return res.join(' > ');
};

export const getFirstNodeByProperty = (nodes, propName: string) => {
  const path = createSelectedPath(nodes, propName);

  return path.length > 0 ? nodes.getIn(path) : null;
};
