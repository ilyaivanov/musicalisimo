import * as React from 'react';
import styled from 'styled-components';

const Item = styled.div`
  marginLeft: 15px;
`;
const handlerWidth = 12;
const Text = styled.span`
  display: inline-block;
  ${props => props.isSpecial && `
    fontStyle: italic;
  `}
  
  ${props => props.isSelected && `
    fontWeight: bold;
    backgroundColor: gold;
    width: calc(100% - ${handlerWidth}px);
  `};
`;

const Childs = styled.div`
  borderLeft: 1px solid #eee;
  marginLeft: 5px;
`;

const Handler = styled.span`
  display: inline-block;
  width: ${handlerWidth}px;
  fontSize: 15px;
`;

const getHandler = node =>
  <Handler>{node.isHidden || !node.child ? '▸' : '▾'}</Handler>;

const renderNode = node => (
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

const tree = ({ nodes }) => (
  <div>
    {nodes.map(renderNode)}
  </div>
);

export default tree;