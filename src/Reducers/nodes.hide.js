export default function reducer(rootNodes = [], action) {
  if (action.type === 'hide')
    return rootNodes.updateIn(action.selectionPath, node => node.merge({ isHidden: true }));

  if (action.type === 'show')
    return rootNodes.updateIn(action.selectionPath, node => node.merge({ isHidden: false }));

  return rootNodes;
}