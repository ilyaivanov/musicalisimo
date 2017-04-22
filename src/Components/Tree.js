import * as React from 'react';
import styled from 'styled-components';

const Item = styled.div`
  marginLeft: 15px;
`;

const Text = styled.span`
  ${props => props.isSpecial && `
    fontStyle: italic;
  `}
  
  ${props => props.isSelected && `
    fontWeight: bold;
    display: block;
    width: 100%;
    backgroundColor: gold;
  `};
`;

const Childs = styled.div`
  borderLeft: 1px solid #eee;
  marginLeft: 5px;
`;

const renderNode = node => (
  <Item key={node.id}>
    <Text
      isSelected={node.isSelected}
      isSpecial={node.isSpecial}
    >
      {node.text}
      {node.isHidden ? ' +' : ''}
      {node.isLoading ? ' loading...' : ''}
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