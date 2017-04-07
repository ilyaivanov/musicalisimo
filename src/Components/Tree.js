import * as React from 'react';
import styled from 'styled-components';

const Item = styled.div`
  marginLeft: 10px;
`;

const SelectedItem = styled.span`
  fontWeight: bold;
`;

const renderNode = node => (
  <Item key={node.id}>
    {node.isSelected ? <SelectedItem>{node.text}</SelectedItem> : node.text}
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