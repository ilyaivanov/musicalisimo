import {fromJS} from 'immutable';
import newReducer, {
  createSelectedPath, firstArrayIncludesSecondFromStart,
  getLeftPath,
  getNextNodePath, getRightPath,
  getUpUp,
} from './nodes.traversal';
import {moveDown, moveUp} from '../Containers/InputHandler/actions';
import {node, join} from '../utils/testingUtils';

const selectedNode = (text: string, props?: {}) => node(text, {isSelected: true, ...props});
export const nodes = fromJS([
  node('0'),
  node('1', {
    child: [
      node('1.0', {
        child: [
          node('1.0.0', {
            child: [
              node('1.0.0.0'),
              node('1.0.0.1'),
            ],
            isHidden: true
          }),
          node('1.0.1', {
            child: [
              node('1.0.1.0')
            ]
          }),
        ]
      }),
      node('1.1'),
    ]
  }),
  node('2'),
]);

it('join specs', () => {
  expect(join([1, 2, 3])).toEqual([1, 'child', 2, 'child', 3]);
});

it('Getting next node path', () => {
  expect(getNextNodePath(join([1, 0, 0]), nodes))
    .toEqual(join([1, 0, 1]));

  expect(getNextNodePath([0], nodes))
    .toEqual([1]);

  expect(getNextNodePath([1], nodes))
    .toEqual(join([1, 0]));

  expect(getNextNodePath(join([1, 0]), nodes))
    .toEqual(join([1, 0, 0]));

  expect(getNextNodePath(join([1, 0, 1]), nodes))
    .toEqual(join([1, 0, 1, 0]));

  expect(getNextNodePath(join([1, 0, 0, 0]), nodes))
    .toEqual(join([1, 0, 0, 1]));

  expect(getNextNodePath(join([1, 0, 1, 0]), nodes))
    .toEqual(join([1, 1]));

  expect(getNextNodePath(join([1, 1]), nodes))
    .toEqual([2]);

  expect(getNextNodePath([2], nodes))
    .toEqual([2]);
});

it('Getting previous node path', () => {
  expect(getUpUp([1], nodes))
    .toEqual([0]);

  expect(getUpUp(join([1, 1]), nodes))
    .toEqual(join([1, 0, 1, 0]));

  expect(getUpUp(join([1, 0, 1]), nodes))
    .toEqual(join([1, 0, 0]));

  expect(getUpUp(join([1, 0, 0, 1]), nodes))
    .toEqual(join([1, 0, 0, 0]));

  expect(getUpUp([0], nodes))
    .toEqual([0]);
});

it('Getting left node path', () => {
  expect(getLeftPath(join([1, 0]), nodes))
    .toEqual([1]);

  expect(getLeftPath([1], nodes))
    .toEqual([1]);
});

it('Getting right node path', () => {
  expect(getRightPath([1], nodes))
    .toEqual(join([1, 0]));
});

it('Creating selected path', () => {
  const selectionPath = join([1, 0, 1, 0]);
  const selectedNodes = nodes.updateIn(selectionPath, n => n.merge({isSelected: true}));
  expect(createSelectedPath(selectedNodes)).toEqual(selectionPath);
});

it('Creating selected path by passing a function', () => {
  const selectionPath = join([1, 0, 1, 0]);
  const selectedNodes = nodes.updateIn(selectionPath, n => n.merge({isSelected: true}));
  expect(createSelectedPath(selectedNodes, n => !!n.get('isSelected'))).toEqual(selectionPath);
});

it('Having no selected nodes createSelectionPath should return []', () => {
  expect(createSelectedPath(nodes)).toEqual([]);
});
it('Moving down action', () => {
  const givenNodes = fromJS([
    selectedNode('1'),
    node('2')
  ]);
  const expected = fromJS([
    node('1'),
    selectedNode('2')
  ]);
  const received = newReducer(givenNodes, moveDown());
  expect(received).toEqual(expected);
});

it('Moving up action', () => {
  const givenNodes = fromJS([
    node('1'),
    selectedNode('2'),
  ]);
  const expected = fromJS([
    selectedNode('1'),
    node('2'),
  ]);
  const received = newReducer(givenNodes, moveUp());
  expect(received).toEqual(expected);
});

it('Default action', () => {
  expect(newReducer(undefined, {type: 'unique'})).toEqual(fromJS([]));
});

it('in the context should do nothing', () => {
  const givenNodes = fromJS([
    node('0'),
    node('1', {
      isContext: true,
      child: [
        node('1.1', {isSelected: true}),
      ]
    }),
    node('2'),
  ]);

  const received = newReducer(givenNodes, moveDown());

  expect(received).toEqual(givenNodes);
});

it('array ', () => {
  expect(firstArrayIncludesSecondFromStart([1], [1])).toEqual(true);
  expect(firstArrayIncludesSecondFromStart([1, 2], [1])).toEqual(true);
  expect(firstArrayIncludesSecondFromStart([1], [1, 2])).toEqual(false);
  expect(firstArrayIncludesSecondFromStart([1, 2, 3], [1, 3])).toEqual(false);
});