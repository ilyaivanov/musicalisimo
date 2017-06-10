import * as React from 'react';
import {returntypeof} from 'react-redux-typescript';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Tree from '../Components/Tree/Tree';
import Tab from '../Components/Tab';
import Header from '../Components/Header';
import * as actions from './InputHandler/actions';
import {getFirstNodeByProperty, joinNamesForPath} from './selectors';
import {createSelectedPath} from '../Reducers/nodes.traversal';
import Icon from '../Components/Icon';
import {AppState} from '../types';

const mapStateToProps = (state: AppState) => ({
  favorites: state.favorites,
  filter: state.filter,
  isCleanView: state.userSettings.isCleanView,
  contextNode: getFirstNodeByProperty(state.favorites.nodes, 'isContext'),
  contextText: joinNamesForPath(state.favorites.nodes, createSelectedPath(state.favorites.nodes, 'isContext')),
});

// bindActionCreators doesn't recognize import * as actions, so using as any here
const mapDispatchToProps = (dispatch) => bindActionCreators(actions as any, dispatch);

const stateProps = returntypeof(mapStateToProps);
type Props = typeof actions & typeof stateProps;

const Favorites: React.StatelessComponent<Props> = (props: Props) => {
  const {favorites: {isFocused}, favorites, contextNode, contextText, removeContext} = props;
  return (
    <Tab
      showFull={isFocused}
      right={true}
      isFocused={isFocused}
      onClick={props.selectFavorites}
    >
      <Header>
        {contextNode ?
          <span>{contextText} <Icon name="remove" onClick={removeContext}/></span> : 'Favorites'}
      </Header>
      <Tree
        isClean={props.isCleanView}
        filter={props.filter}
        nodes={contextNode ? contextNode.get('child').toJS() : favorites.nodes.toJS()}
        onNodeTextChange={props.updateNodeText}
        showSelected={isFocused}
        onNodeIconClick={props.onNodeIconClick}
        showNodeById={id => props.showNodeById(id)}
        hideNodeById={id => props.hideNodeById(id)}
      />
    </Tab>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);