import {fromJS} from 'immutable';
import {node, join} from '../utils/testingUtils';
import {createSelectedPath} from './nodes.traversal';
import reducer from './nodes.hide';
import {getCurrentlyPlayingTrackPath} from '../Player/actions';

describe('playing a long-nested node', () => {
  const nodes = fromJS([
    node('0'),
    node('1', {
      child: [
        node('1.0'),
        node('1.1', {
          child: [
            node('1.1.0', {isSelected: true, type: 'track'}),
            node('1.1.1'),
          ]
        }),
      ]
    }),
    node('2'),
  ]);
  const playedNodes = fromJS([
    node('0'),
    node('1', {
      child: [
        node('1.0'),
        node('1.1', {
          child: [
            node('1.1.0', {isSelected: true, type: 'track', isPlaying: true}),
            node('1.1.1'),
          ],
          isPlaying: true,
        }),
      ],
      isPlaying: true,
    }),
    node('2'),
  ]);
  it('should mark isPlaying all nodes to the root', () => {
    const selectionPath = createSelectedPath(nodes);
    const action = {
      type: 'play',
      node: nodes.getIn(selectionPath),
      currentTrackPath: [],
      trackToPlayPath: selectionPath
    };
    const received = reducer(nodes, action);
    expect(received).toEqual(playedNodes);
  });

  it('getCurrentlyPlayingTrackPath test', () => {
    expect(getCurrentlyPlayingTrackPath(playedNodes)).toEqual(join([1, 1, 0]));
  });
});