import {fromJS} from 'immutable';
import {updateIds} from './mutators';

export const node = (text: string, props?: {}) => ({id: text, text, ...props});

describe('updating a node', () => {
  it('will create new ids for all subnodes', () => {
    const nodeToChange = fromJS(
      node('1', {
        child: [
          node('2'),
          node('3', {
            child: [
              node('4')
            ]
          })]
      })
    );

    const sample = () => '66666';
    const received = updateIds(nodeToChange, sample);
    expect(received.getIn(['id'])).toEqual('66666');
    expect(received.getIn(['child', 0, 'id'])).toEqual('66666');
    expect(received.getIn(['child', 1, 'child', 0, 'id'])).toEqual('66666');
  });
});