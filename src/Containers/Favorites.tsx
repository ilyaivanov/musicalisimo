import * as React from 'react';
import Tree from '../Components/Tree';
import {connect} from 'react-redux';
import {selectFavorites, updateNodeText} from './InputHandler/actions';
import Tab from '../Components/Tab';
import Header from '../Components/Header';
import {getFirstNodeByProperty} from './selectors';

class Favorites extends React.PureComponent<any, any> {
  render() {
    const {contextNode} = this.props;
    return (
      <Tab
        right={true}
        isFocused={this.props.favorites.isFocused}
        onClick={this.props.selectFavorites}
      >
        <Header style={{'textAlign': 'center'}}>{contextNode ? contextNode.get('text') : 'Favorites'}</Header>
        <Tree
          nodes={contextNode ? contextNode.get('child').toJS() : this.props.favorites.nodes.toJS()}
          onNodeTextChange={this.props.updateNodeText}
        />
      </Tab>
    );
  }
}

const mapStateToProps = (props: any) => ({
  favorites: props.favorites,
  contextNode: getFirstNodeByProperty(props.favorites.nodes, 'isContext'),
});

const mapDispatchToProps = {
  selectFavorites,
  updateNodeText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);