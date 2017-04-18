import React from 'react';
import styled from 'styled-components';
import { queueWidth } from "../constants";
import Tree from "../Components/Tree";
import { connect } from "react-redux";

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  marginRight: ${queueWidth}px;
  width: calc(50% - ${queueWidth}px);
  border-left: 1px solid grey;
  
`;
const Header = styled.h1`
  textAlign: center;
`;

class Favorites extends React.PureComponent {
  render() {
    return (
      <PlayerContainer>
        <Header>Favorites</Header>
        <Tree nodes={this.props.favorites}/>
      </PlayerContainer>
    );
  }
}

const mapStateToProps = ({ favorites }) => ({ favorites });


export default connect(mapStateToProps)(Favorites);