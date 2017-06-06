import * as React from 'react';
import Tree from '../Components/Tree';
import {connect} from 'react-redux';
import {selectFavorites, updateNodeText} from './InputHandler/actions';
import Tab from '../Components/Tab';
import Header from '../Components/Header';
import {getFirstNodeByProperty, joinNamesForPath} from './selectors';
import {createSelectedPath} from '../Reducers/nodes.traversal';

class Favorites extends React.PureComponent<any, any> {
  render() {
    const {contextNode, contextText} = this.props;
    return (
      <Tab
        right={true}
        isFocused={this.props.favorites.isFocused}
        onClick={this.props.selectFavorites}
      >
        <Header
          style={{'textAlign': 'center'}}
        >
          {contextNode ? contextText : 'Favorites'}
        </Header>
        <Tree
          nodes={contextNode ? contextNode.get('child').toJS() : this.props.favorites.nodes.toJS()}
          onNodeTextChange={this.props.updateNodeText}
          showSelected={this.props.favorites.isFocused}
        />
      </Tab>
    );
  }
}

const mapStateToProps = (props: any) => ({
  favorites: props.favorites,
  contextNode: getFirstNodeByProperty(props.favorites.nodes, 'isContext'),
  contextText: joinNamesForPath(props.favorites.nodes, createSelectedPath(props.favorites.nodes, 'isContext')),
});

const mapDispatchToProps = {
  selectFavorites,
  updateNodeText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);