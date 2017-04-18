import nodesReducer from './nodes';

const initialNodes = [];
export default function reducer(allNodes = initialNodes, action) {
  if(action.type ==='add_to_favorites'){
    return allNodes.concat(action.item);
  }
  if(action.isFavorites){
    return nodesReducer(allNodes, action);
  }
  return allNodes;
}