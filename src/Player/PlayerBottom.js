import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import YoutubePlayer from "../Components/YoutubePlayer";
import { footerHeight } from "../constants";

const PlayerContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: ${footerHeight}px;
  background-color: #efefef;
  text-align: center;
  verticalAlign: middle;
`;

class Player extends React.PureComponent {
  setPlayer(player) {
    console.log(player);
  }

  render() {
    const { currentArtist, currentAlbum, currentTrack, video } = this.props.player;
    return (
      <PlayerContainer>
        {currentArtist} - {currentAlbum} - {currentTrack}
        <YoutubePlayer id={video ? video.id : null} onReady={this.setPlayer}/>
      </PlayerContainer>
    );
  }
}

const mapStateToProps = ({ player }) => ({ player });

export default connect(mapStateToProps)(Player);
