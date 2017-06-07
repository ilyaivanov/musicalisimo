import {createFlatNodes} from './selectors';
import {MNode} from '../types';

const node = (text: string, props?: {}): MNode => ({id: text, text, ...props}) as MNode;

it('flattening nodes should result in one-dimensional array each item having a level property', () => {
  const nodes = [
    node('0', {
      child: [
        node('0.1', {
          isHidden: true,
          child: [
            node('0.1.0')
          ]
        }),
        node('0.2', {
          child: [
            node('0.2.0'),
            node('0.2.1'),
            node('0.2.2'),
          ]
        }),
        node('0.3'),
      ]
    }),
    node('1')
  ];
  const expectedFlatenNodes = [
    node('0', {level: 1, childLength: 3}),
    node('0.1', {level: 2, isHidden: true, childLength: 1}),
    // node('0.1.0', {level: 3}),
    node('0.2', {level: 2, childLength: 3}),
    node('0.2.0', {level: 3, childLength: 0}),
    node('0.2.1', {level: 3, childLength: 0}),
    node('0.2.2', {level: 3, childLength: 0}),
    node('0.3', {level: 2, childLength: 0}),
    node('1', {level: 1, childLength: 0}),
  ];
  const res = createFlatNodes(nodes);

  expect(res).toEqual(expectedFlatenNodes);

});