import * as React from 'react';
import styled from 'styled-components';
import {icons} from './treeIcons';
import {createFlatNodes, LeveredNode} from './selectors';
import Icon from './Icon';

const oneLevelPadding = 20;
const Node = styled.div`
  width: ${(props: any) => `calc(70% - ${props.level * oneLevelPadding}px)`};
  // borderRight: 1px solid grey;
  display: inline-block;
` as any;

const Tag = styled.small`
  marginLeft: 10px;
` as any;

// old f0f4f7 from mockup
// 05 - C4DFE6 66A5AD
// 30 - D0E1F9 4D648D
// 42 - EAE2D6 D5C3AA 867666 E1B80D
const Stripe = styled.div`
  width: 100%;
  ${(props: any) => props.isEven && `backgroundColor: #f0f4f7;`}
  ${(props: any) => props.isSelected && `backgroundColor: #EAE2D6;`}
  paddingLeft: ${(props: any) => props.level * oneLevelPadding}px;
` as any;

const Text = styled.span`
  display: inline-block;
  paddingLeft: 10px;
  marginTop: 5px;
  marginBottom: 5px;
  height: 20px;
  ${(props: any) => props.isSelected && `
  marginTop: 20px;
  height: 25px;
  marginBottom: 15px;
  `}
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
const SimpleNode = styled.span`
  fontWeight: bold;
  textOverflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const NodeText = (props) => props.node.isEditing ?
  <NodeBeingEdited {...props}/> :
  <SimpleNode>{props.node.text}</SimpleNode>;

class Tree extends React.PureComponent<any, any> {
  renderNode(node: LeveredNode, onNodeTextChange: (s: string) => void, showSelected: boolean, isEven: boolean): JSX.Element {
    return (
      <Stripe
        key={node.id}
        isEven={isEven}
        isSelected={showSelected && node.isSelected}
        level={node.level}
      >
        <Node level={node.level}>
          <Icon name={icons[node.type]}/>
          <Text>
            <NodeText
              node={node}
              onNodeTextChange={onNodeTextChange}
            />
            {node.isLoading ? ' loading...' : ''}
            {node.isPlaying ? ' playing...' : ''}
            {node.isHidden && <small>{' '}({node.childLength})</small>}
          </Text>
        </Node>
        {(node.type === 'album') && ['sampleTag', 'anotherTag'].map(t => <Tag>{t}</Tag>)}
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