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

// onLoseFocus - stopediting
const NodeText = (props) => {
  const node: MNode = props.node;
  if (node.isEditing) {
    return (
      <input
        type="text"
        onClick={e => e.stopPropagation()}
        onChange={e => props.onNodeTextChange(e.currentTarget.value)}
        value={node.text}
        autoFocus={true}
      />
    );
  } else {
    return <span>{node.text}</span>;
  }
};

const getHandler = (node: MNode) =>
  <Handler>{handlers[node.type] || ''}</Handler>;

const renderNode = (node: MNode, onNodeTextChange: (s: string) => void): JSX.Element => (
  <Item key={node.id}>
    {getHandler(node)}
    <Text
      isSelected={node.isSelected}
      isSpecial={node.isSpecial}
    >
      <NodeText node={node} onNodeTextChange={onNodeTextChange}/>
      {node.isLoading ? ' loading...' : ''}
      {node.isPlaying ? ' playing...' : ''}
      {node.child && node.isHidden && <small>{' '}({node.child.length})</small>}
    </Text>
    <Childs>
      {!node.isHidden && node.child && node.child.map(n => renderNode(n, onNodeTextChange))}
    </Childs>
  </Item>
);

const tree = (props: { nodes: MNode[], onNodeTextChange: (s: string) => void }) => (
  <div>
    {props.nodes.map(n => renderNode(n, props.onNodeTextChange))}
  </div>
);

export default tree;