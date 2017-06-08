import * as React from 'react';
import styled from 'styled-components';
import {icons} from './treeIcons';
import {createFlatNodes, filterNodes, LeveredNode} from './selectors';
import Icon from './Icon';
import {formatTimeOmitHour} from '../utils/timeFormat';

const oneLevelPadding = 20;

// old f0f4f7 from mockup
// 05 - C4DFE6 66A5AD
// 30 - D0E1F9 4D648D
// 42 - EAE2D6 D5C3AA 867666 E1B80D
const Stripe = styled.div`
  width: 100%;
  ${(props: any) => props.isEven && `backgroundColor: #f0f4f7;`}
  ${(props: any) => props.isSelected && `backgroundColor: #EAE2D6;`}
  ${(props: any) => props.isPlaying && `backgroundColor: #D0E1F9;`}
  paddingLeft: ${(props: any) => props.level * oneLevelPadding}px;
` as any;

const Node = styled.div`
  position: relative;
  ${(props: any) => props.isClean ?
  `width: 100%` :
  `width: calc(70% - ${props.level * oneLevelPadding}px);`
  }
  // borderRight: 1px solid #E1B80D;
  display: inline-block;
` as any;

const Tag = styled.span`
  fontSize: 12px;
  marginLeft: 5px;
` as any;

const Info = styled.div`
  fontSize: 12px;
  position: absolute;
  top:5px;
  bottom: 0;
  right: 5px;
`;
const Text = styled.span`
  display: inline-block;
  paddingLeft: 10px;
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
const SimpleNode = styled.span`
  fontWeight: bold;
  textOverflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  paddingRight: 3px;
`;

const NodeText = (props) => props.node.isEditing ?
  <NodeBeingEdited {...props}/> :
  <SimpleNode>{props.node.text}</SimpleNode>;

class Tree extends React.PureComponent<any, any> {
  renderNode(node: LeveredNode,
             onNodeTextChange: (s: string) => void,
             showSelected: boolean,
             isEven: boolean): JSX.Element {
    const isClean = this.props.isClean;
    return (
      <Stripe
        key={node.id}
        isEven={isEven}
        isSelected={showSelected && node.isSelected}
        level={node.level}
      >
        <Node level={node.level} isClean={isClean}>
          <Icon name={icons[node.type]} played={node.isPlaying}/>
          <Text>
            <NodeText
              node={node}
              onNodeTextChange={onNodeTextChange}
            />
            {node.isLoading ? <Icon name={'spinner'} spin={true}/> : ''}
            {node.isHidden && <small>{' '}({node.childLength})</small>}
          </Text>
          {node.listeners && !isClean && <Info>{node.listeners}</Info>}
          {node.duration && !isClean && <Info>{formatTimeOmitHour(node.duration)}</Info>}
        </Node>
        {(node.type === 'album' && node.tags && !isClean) && <Tag>{node.tags.join(', ')}</Tag>}
      </Stripe>
    );
  }

  render() {
    const flatnodes = createFlatNodes(this.props.nodes);
    const filtered = this.props.filter ? filterNodes(flatnodes, this.props.filter) : flatnodes;
    return (
      // 57 - ugly constant, height of the Favorites Header
      <div
        style={{height: `calc(100% - 57px)`, 'overflowY': 'auto', 'overflowX': 'hidden'}}
        ref={el => this.setState({container: el})}
      >
        {filtered.map((n, i) => this.renderNode(n, this.props.onNodeTextChange, this.props.showSelected, i % 2 === 0))}
      </div>
    );
  }
}

export default Tree;