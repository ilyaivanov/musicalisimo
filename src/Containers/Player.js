import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import Youtube from 'react-youtube';

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

const YoutubePlayer = styled(Youtube)`
  position: absolute;
  right: ${20 + 285}px;
  bottom: 20px;
`;

class Player extends React.PureComponent {
  setPlayer(player) {
    console.log(player);
  }

  render() {
    const { player } = this.props;
    const opts = {
      height: 150,
      width: 220,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    return (
      <PlayerContainer>
        <h3>Queue</h3>
        {player.queue.map(renderItem)}
        <YoutubePlayer
          videoId={'hcskSDph5ZY'}
          opts={opts}
          onEnd={this.props.playNextTrack}
          onReady={e => this.setPlayer(e.target)}>
        </YoutubePlayer>
      </PlayerContainer>
    );
  }
}

const mapStateToProps = ({ player }) => ({ player });


export default connect(mapStateToProps)(Player);
