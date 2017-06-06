import {fromJS} from 'immutable';
import {joinNamesForPath} from './selectors';
import {createSelectedPath} from '../Reducers/nodes.traversal';

const node = (text: string, props?: {}) => ({id: text, text, ...props});

describe('having nested nodes with context', () => {
  it('joined text should be returned', () => {
    const nodes = fromJS([
      node('0'),
      node('1', {
        child: [
          node('1.0', {
            isContext: true, child: [
              node('1.0.1')
            ]
          }),
          node('1.1'),
        ]
      }),
    ]);
    const expectedFullPath = '1 > 1.0';
    const recivedPath = joinNamesForPath(nodes, createSelectedPath(nodes, 'isContext'));

    expect(recivedPath).toEqual(expectedFullPath);
  });
});