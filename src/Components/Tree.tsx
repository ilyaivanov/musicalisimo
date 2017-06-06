import * as React from 'react';
import styled from 'styled-components';

import {MNode} from '../types';

const Item = styled.div`
  marginLeft: 15px;
`;
const handlerWidth = 18;
const Text = styled.span`
  display: inline-block;
  ${(props: any) => props.isSpecial && `
    fontStyle: italic;
  `}
  
  ${(props: any) => props.isSelected && `
    fontWeight: bold;
    backgroundColor: gold;
    width: calc(100% - ${handlerWidth}px);
  `};
` as any;

const Childs = styled.div`
  borderLeft: 1px solid #eee;
  marginLeft: 5px;
`;

const Handler = styled.span`
  display: inline-block;
  width: ${handlerWidth}px;
  fontSize: 15px;
`;

const handlers = {
  album: '💿',
  artist: '👤',
  track: '🎜',
  playlist: '☰',
};

const getHandler = (node: MNode) =>
  <Handler>{handlers[node.type] || ''}</Handler>;

const renderNode = (node: MNode): JSX.Element => (
  <Item key={node.id}>
    {getHandler(node)}
    <Text
      isSelected={node.isSelected}
      isSpecial={node.isSpecial}
    >
      {node.text}
      {node.isLoading ? ' loading...' : ''}
      {node.isPlaying ? ' playing...' : ''}
      {node.child && node.isHidden && <small>{' '}({node.child.length})</small>}
    </Text>
    <Childs>
      {!node.isHidden && node.child && node.child.map(renderNode)}
    </Childs>
  </Item>
);

const tree = (props: { nodes: MNode[] }) => (
  <div>
    {props.nodes.map(renderNode)}
  </div>
);

export default tree;