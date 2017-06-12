import * as React from 'react';
import {icons} from '../treeIcons';
import {createFlatNodes, filterNodes, LeveredNode} from '../selectors';
import Icon from '../Icon';
import {formatTimeOmitHour} from '../../utils/timeFormat';
import {
  NodeBeingEdited, Text, Tag, Stripe, Info, SimpleNode, Node,
  ScrollingContainer, Year
} from './styles';

const NodeText = (props) => props.node.isEditing ?
  <NodeBeingEdited {...props}/> :
  <SimpleNode>{props.node.text}</SimpleNode>;

interface Props {
  onNodeTextChange: (s: string) => void;
  onNodeIconClick: Function;
  showNodeById: Function;
  hideNodeById: Function;
  showSelected: boolean;
  isClean: boolean;
  filter: string;
  nodes: any;
}

const Tree: React.StatelessComponent<Props> = (props: Props) => {
  const renderNode = (node: LeveredNode,
                      onNodeTextChange,
                      showSelected: boolean,
                      isEven: boolean): JSX.Element => {
    const {isClean} = props;
    return (
      <Stripe
        key={node.id}
        isEven={isEven}
        isSelected={showSelected && node.isSelected}
        level={node.level}
      >
        {
          (node.isHidden || !node.hasChild) ?
            <Icon name={'plus'} onClick={() => props.showNodeById(node.id)}/> :
            <Icon name={'minus'} onClick={() => props.hideNodeById(node.id)}/>
        }
        <Node level={node.level} isClean={isClean}>
          <Icon
            name={icons[node.type]}
            played={node.isPlaying}
            onClick={() => props.onNodeIconClick(node.id)}
          />
          <Text>
            {node.type === 'album' && <Year>{node.album.year}</Year>}
            <NodeText
              node={node}
              onNodeTextChange={onNodeTextChange}
            />
            {node.isLoading ? <Icon name={'spinner'} spin={true}/> : ''}
            {node.isHidden && <small>{' '}({node.childLength})</small>}
          </Text>
          {node.listeners && !isClean && <Info>{node.listeners}</Info>}
          <Tag>{node.type === 'artist' && node.artist.disambiguation}</Tag>
          {node.duration && !isClean && <Info>{formatTimeOmitHour(node.duration)}</Info>}
        </Node>
        {(node.type === 'album' && node.tags && !isClean) &&
        <Tag>{node.tags.join(', ')}</Tag>}
      </Stripe>
    );
  };

  const nodes = filterNodes(createFlatNodes(props.nodes), props.filter);
  return (
    <ScrollingContainer>
      {nodes.map((n, i) => renderNode(n, props.onNodeTextChange, props.showSelected, i % 2 === 0))}
    </ScrollingContainer>
  );
};

export default Tree;