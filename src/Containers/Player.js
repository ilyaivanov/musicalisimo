import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 285px;
  border-left: 1px solid grey;
`;
const Title = styled.h3`
  textAlign: center;
`;

const Player = ({player}) => (
  <PlayerContainer >
    <Title>Player</Title>
    <div>{player.track}</div>
  </PlayerContainer>
);

const mapStateToProps = ({ player }) => ({ player });


export default connect(mapStateToProps)(Player);
