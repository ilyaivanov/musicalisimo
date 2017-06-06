import {createSelectedPath} from '../Reducers/nodes.traversal';
export const getFirstNodeByProperty = (nodes, propName) =>{
  const path = createSelectedPath(nodes, propName);

  return path.length > 0 ? nodes.getIn(path) : null;
};
