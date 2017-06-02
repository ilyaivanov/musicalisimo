import { v4 } from "uuid";
export const playNode = node => node.merge({ isPlaying: true });
export const unplayNode = node => node.merge({ isPlaying: false });

export const showNode = node => node.merge({ isHidden: false });
export const hideNode = node => node.merge({ isHidden: true });

export const updateIds = (node, idGenerator = v4) => {
  const newNode = node.set('id', idGenerator());
  if (newNode.get('child'))
    return newNode.update('child', subnodes => subnodes.map(n => updateIds(n, idGenerator)));
  else
    return newNode;
};