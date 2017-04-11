import * as React from 'react';
import styled from 'styled-components';

const Item = styled.div`
  marginLeft: 10px;
`;

const Text = styled.span`
  fontWeight: ${props => props.isSelected ? 'bold' : 'auto'};
  fontStyle: ${props => props.isSpecial ? 'italic' : 'auto'};
`;

const renderNode = node => (
  <Item key={node.id}>
    <Text
      isSelected={node.isSelected}
      isSpecial={node.isSpecial}
    >
      {node.text}
    </Text>
    {node.isLoading ? ' loading...' : ''}
    {node.isHidden ? ' loaded' : ''}
    {!node.isHidden && node.child && node.child.map(renderNode)}
  </Item>
);

const tree = ({ nodes }) => (
  <div>
    {nodes.map(renderNode)}
  </div>
);

export default tree;