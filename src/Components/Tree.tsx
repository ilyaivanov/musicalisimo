import * as React from 'react';
import styled from 'styled-components';
import {MNode} from '../types';
import {icons} from './treeIcons';
import {createFlatNodes, LeveredNode} from './selectors';

const oneLevelPadding = 20;

const Stripe = styled.div`
  width: 100%;
  ${(props: any) => props.isEven && `backgroundColor: #f0f4f7;`}
` as any;

const Text = styled.span`
  display: inline-block;
  ${(props: any) => props.isSpecial && `
    fontStyle: italic;
  `}
  
  ${(props: any) => props.isSelected && `
    backgroundColor: gold;
  `};
  marginTop: 5px;
  marginBottom: 5px;
  height: 20px;
` as any;

const NodeBeingEdited = (props: any) => (
  <input
    type="text"
    onClick={e => e.stopPropagation()}
    onChange={e => props.onNodeTextChange(e.currentTarget.value)}
    value={props.node.text}
    autoFocus={true}
  />
);
const SimpleNode = (props: any) => (
  <span><b>{props.text}</b></span>
);
const NodeText = (props) => props.node.isEditing ?
  <NodeBeingEdited {...props}/> :
  <SimpleNode text={props.node.text}/>;

class Tree extends React.PureComponent<any, any> {
  getHandler = (node: MNode) =>
    <span>{icons[node.type] || ''}</span>

  renderNode(node: LeveredNode, onNodeTextChange: (s: string) => void, showSelected: boolean, isEven: boolean): JSX.Element {
    return (
      <Stripe key={node.id} isEven={isEven} style={{paddingLeft: oneLevelPadding * node.level}}>
        {this.getHandler(node)}
        <Text
          isSelected={showSelected && node.isSelected}
          isSpecial={node.isSpecial}
        >
          <NodeText
            isSelected={showSelected && node.isSelected}
            node={node}
            onNodeTextChange={onNodeTextChange}
          />
          {node.isLoading ? ' loading...' : ''}
          {node.isPlaying ? ' playing...' : ''}
          {node.isHidden && <small>{' '}({node.childLength})</small>}
        </Text>
      </Stripe>
    );
  }

  render() {
    const flatnodes = createFlatNodes(this.props.nodes);
    return (
      <div
        style={{height: `calc(100% - 75px)`, 'overflow': 'hidden'}}
        ref={el => this.setState({container: el})}
      >
        {flatnodes.map((n, i) => this.renderNode(n, this.props.onNodeTextChange, this.props.showSelected, i % 2 === 0))}
      </div>
    );
  }
}

export default Tree;