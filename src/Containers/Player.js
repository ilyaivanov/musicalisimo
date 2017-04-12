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
  textAlign: center;
`;
const renderItem = item => (
  <div key={item.id}>
    <div>{item.artistName} - {item.albumName}</div>
    <div>{item.trackName}
      {/*<small>04:20</small>*/}
    </div>
  </div>
);

const Player = ({ player }) => (
  <PlayerContainer>
    <h3>Queue</h3>
    {player.queue.map(renderItem)}
  </PlayerContainer>
);

const mapStateToProps = ({ player }) => ({ player });


export default connect(mapStateToProps)(Player);
