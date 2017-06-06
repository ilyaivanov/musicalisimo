import * as React from 'react';
import * as ReactDOM from 'react-dom';

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
    return <span ref={props.innerRef}>{node.text}</span>;
  }
};

class NodeTextP extends React.PureComponent<any, any> {

  constructor() {
    super();
    this.state = {};
  }

  scrollToBottom = () => {
    if (this.props.isSelected && this.state.el) {
      const node = ReactDOM.findDOMNode(this.state.el);
      node.scrollIntoView(false);
    }
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  save(el: any) {
    this.setState({el});
  }

  render() {
    return (
      <NodeText
        innerRef={el => this.props.isSelected ? this.save(el) : {}}
        node={this.props.node}
        onNodeTextChange={this.props.onNodeTextChange}
      />
    );
  }
}

class Tree extends React.PureComponent<any, any> {
  getHandler = (node: MNode) =>
    <Handler>{handlers[node.type] || ''}</Handler>

  renderNode(node: MNode, onNodeTextChange: (s: string) => void, showSelected: boolean): JSX.Element {
    return (
      <Item key={node.id}>
        {this.getHandler(node)}
        <Text
          isSelected={showSelected && node.isSelected}
          isSpecial={node.isSpecial}
        >
          <NodeTextP
            isSelected={showSelected && node.isSelected}
            node={node}
            onNodeTextChange={onNodeTextChange}
          />
          {node.isLoading ? ' loading...' : ''}
          {node.isPlaying ? ' playing...' : ''}
          {node.child && node.isHidden && <small>{' '}({node.child.length})</small>}
        </Text>
        <Childs>
          {!node.isHidden && node.child && node.child.map(n => this.renderNode(n, onNodeTextChange, showSelected))}
        </Childs>
      </Item>
    );
  }

  render() {
    return (
      <div
        style={{height: `calc(100% - 75px)`, 'overflow': 'hidden'}}
        ref={el => this.setState({container: el})}
      >
        {this.props.nodes.map(n => this.renderNode(n, this.props.onNodeTextChange, this.props.showSelected))}
      </div>
    );
  }
}

export default Tree;