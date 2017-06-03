import * as React from 'react';
import Tree from '../Components/Tree';
import {connect} from 'react-redux';
import {selectFavorites} from './actions';
import Tab from '../Components/Tab';
import Header from '../Components/Header';

class Favorites extends React.PureComponent<any, any> {
  render() {
    return (
      <Tab
        right={true}
        isFocused={this.props.favorites.isFocused}
        onClick={this.props.selectFavorites}
      >
        <Header>Favorites</Header>
        <Tree nodes={this.props.favorites.nodes.toJS()}/>
      </Tab>
    );
  }
}

const mapStateToProps = (props: any) => ({favorites: props.favorites});

const mapDispatchToProps = {selectFavorites};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);