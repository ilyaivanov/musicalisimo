import {fromJS} from 'immutable';
import {insertItemInto} from './mutators';
import {createSelectedPath} from './nodes.traversal';
const node = (text: string, props?: {}) => ({id: text, text, ...props});

it('Adding item into selection path', () => {
  const nodes = fromJS([
    node('0'),
    node('1'),
    node('2', {
      child: [
        node('2.0'),
        node('2.1', {isSelected: true}),
        node('2.2'),
      ]
    }),
    node('3')
  ]);

  const expectedNodes = fromJS([
    node('0'),
    node('1'),
    node('2', {
      child: [
        node('2.0'),
        node('newnode'),
        node('2.1', {isSelected: true}),
        node('2.2'),
      ]
    }),
    node('3')
  ]);
  const receivedNodes = insertItemInto(nodes, createSelectedPath(nodes), fromJS(node('newnode')));

  expect(receivedNodes).toEqual(expectedNodes);
});