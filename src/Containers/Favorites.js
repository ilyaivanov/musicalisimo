import React from 'react';
import styled from 'styled-components';
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import { selectFavorites } from "./actions";
import Tab from "../Components/Tab";


export const Header = styled.h2`
  textAlign: center;
`;

class Favorites extends React.PureComponent {
  render() {
    return (
      <Tab
        isFocused={this.props.favorites.isFocused}
        onClick={this.props.selectFavorites}
        right
      >
        <Header>Favorites</Header>
        <Tree nodes={this.props.favorites.nodes.toJS()}/>
      </Tab>
    );
  }
}

const mapStateToProps = ({ favorites }) => ({ favorites });

const mapDispatchToProps = { selectFavorites };

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);