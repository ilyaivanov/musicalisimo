import * as _ from 'lodash';
import {v4} from 'uuid';
import * as Immutable from 'immutable';
import {Path} from '../types';
import {remove} from './nodes.movement';

type T = Immutable.Map<string, any>;
export const playNode = (node: T) => node.merge({isPlaying: true});
export const unplayNode = (node: T) => node.merge({isPlaying: false});

export const showNode = (node: T) => node.merge({isHidden: false});
export const hideNode = (node: T) => node.merge({isHidden: true});

export const loadingNode = (node: T) => node.merge({isLoading: true});
export const loadedNode = (node: T) => node.merge({isLoading: false});

export const startEditingNode = (node: T) => node.merge({isEditing: true});
export const setNodeText = (node: T, text: string) => node.merge({text});
export const stopEditingNode = (node: T) => node.merge({isEditing: false});

export const insertItemInto = (nodes: any, selectionPath: Path, node) => {
  const lastItem = _.last(selectionPath) || 0;
  const parentContextPath = remove(selectionPath, 1);

  return nodes
    .updateIn(parentContextPath, context => context.insert(+lastItem, node));
};

export const updateIds = (node: T, idGenerator = v4) => {
  const newNode = node.set('id', idGenerator());
  if (newNode.get('child')) {
    return newNode.update('child', subnodes => subnodes.map((n: any) => updateIds(n, idGenerator)));
  } else {
    return newNode;
  }
};