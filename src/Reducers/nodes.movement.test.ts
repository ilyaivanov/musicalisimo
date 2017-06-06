import {fromJS} from 'immutable';
import reducer from './nodes.movement';
import {
  swapNodeDown,
  swapNodeRight,
  swapNodeUp,
  swapNodeLeft
} from '../Containers/InputHandler/actions';

const node = (text: string, props?: {}) => ({id: text, text, ...props});

describe('swapping node down', () => {
  it('simple adjacent nodes to root', () => {
    const nodes = fromJS([
      node('1', {isSelected: true}),
      node('2'),
    ]);

    const res = reducer(nodes, swapNodeDown());

    const expected = fromJS([
      node('2'),
      node('1', {isSelected: true}),
    ]);

    expect(res).toEqual(expected);
  });

  it('moving down for last node should not change anything', () => {
    const nodes = fromJS([
      node('1'),
      node('2', {isSelected: true}),
    ]);

    const res = reducer(nodes, swapNodeDown());

    const expected = fromJS([
      node('1'),
      node('2', {isSelected: true}),
    ]);

    expect(res).toEqual(expected);
  });

  it('adjacent nodes nested two levels deep to root', () => {
    const nodes = fromJS([
      node('0'),
      node('1', {
        child: [
          node('1.0', {
            child: [
              node('1.0.0', {isSelected: true}),
              node('1.0.1'),
            ]
          }),
        ]
      }),
    ]);

    const res = reducer(nodes, swapNodeDown());

    const expected = fromJS([
      node('0'),
      node('1', {
        child: [
          node('1.0', {
            child: [
              node('1.0.1'),
              node('1.0.0', {isSelected: true}),
            ]
          }),
        ]
      }),
    ]);

    expect(res).toEqual(expected);
  });
});

describe('swapping node up', () => {
  it('when adjacent nodes nested two levels deep to root', () => {
    const nodes = fromJS([
      node('0'),
      node('1', {
        child: [
          node('1.0', {
            child: [
              node('1.0.0'),
              node('1.0.1', {isSelected: true}),
            ]
          }),
        ]
      }),
    ]);

    const res = reducer(nodes, swapNodeUp());

    const expected = fromJS([
      node('0'),
      node('1', {
        child: [
          node('1.0', {
            child: [
              node('1.0.1', {isSelected: true}),
              node('1.0.0'),
            ]
          }),
        ]
      }),
    ]);

    expect(res).toEqual(expected);
  });

  it('having two adjacent nodes with first selected', () => {
    const nodes = fromJS([
      node('0', {isSelected: true}),
      node('1'),
    ]);

    const recivedNodes = reducer(nodes, swapNodeUp());
    expect(recivedNodes).toEqual(nodes);
  });
});

describe('swapping node to the right', () => {
  it('for two root nodes', () => {
    const nodes = fromJS([
      node('0', {child: []}),
      node('1', {isSelected: true}),
    ]);
    const expected = fromJS([
      node('0', {
        child: [
          node('1', {isSelected: true}),
        ],
        isHidden: false
      }),
    ]);
    const received = reducer(nodes, swapNodeRight());
    expect(received).toEqual(expected);
  });

  it('for two nested nodes', () => {
    const nodes = fromJS([
      node('0', {
        child: [
          node('1', {isSelected: true}),
        ]
      }),
    ]);

    const received = reducer(nodes, swapNodeRight());

    expect(received).toEqual(nodes);
  });
});

describe('swapping node to the left', () => {
  it('for two nested nodes', () => {
    const nodes = fromJS([
      node('0', {
        child: [
          node('1', {isSelected: true}),
        ]
      }),
    ]);
    const expected = fromJS([
      node('0', {child: []}),
      node('1', {isSelected: true}),
    ]);

    const received = reducer(nodes, swapNodeLeft());

    expect(received).toEqual(expected);
  });

  it('for two deeply nested nodes', () => {
    const nodes = fromJS([
      node('0', {
        child: [
          node('0.0'),
          node('0.1', {
            child: [
              node('0.1.0', {isSelected: true}),
            ]
          }),
        ]
      }),
    ]);

    const expected = fromJS([
      node('0', {
        child: [
          node('0.0'),
          node('0.1', {child: []}),
          node('0.1.0', {isSelected: true}),
        ]
      }),

    ]);

    const received = reducer(nodes, swapNodeLeft());

    expect(received).toEqual(expected);
  });
});
