import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Tree from '../Components/Tree';
import Tab from '../Components/Tab';
import Header from '../Components/Header';
import * as actions from './InputHandler/actions';
import {getFirstNodeByProperty, joinNamesForPath} from './selectors';
import {createSelectedPath} from '../Reducers/nodes.traversal';

class Favorites extends React.PureComponent<any, any> {
  render() {
    const {contextNode, contextText} = this.props;
    return (
      <Tab
        right={true}
        showFull={this.props.favorites.isFocused}
        isFocused={this.props.favorites.isFocused}
        onClick={this.props.selectFavorites}
      >
        <Header
          style={{'textAlign': 'center'}}
        >
          {contextNode ? contextText : 'Favorites'}
        </Header>
        <Tree
          filter={this.props.filter}
          nodes={contextNode ? contextNode.get('child').toJS() : this.props.favorites.nodes.toJS()}
          onNodeTextChange={this.props.updateNodeText}
          showSelected={this.props.favorites.isFocused}
        />
      </Tab>
    );
  }
}

const mapStateToProps = (state: any) => ({
  favorites: state.favorites,
  filter: state.filter,
  contextNode: getFirstNodeByProperty(state.favorites.nodes, 'isContext'),
  contextText: joinNamesForPath(state.favorites.nodes, createSelectedPath(state.favorites.nodes, 'isContext')),
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions as any, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);