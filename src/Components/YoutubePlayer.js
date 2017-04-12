import React from 'react';
import styled from 'styled-components';
import Youtube from 'react-youtube';

const Player = styled(Youtube)`
  position: absolute;
  right: ${20 + 285}px;
  bottom: 20px;
`;

export default class YoutubePlayer extends React.PureComponent {
  render() {
    const opts = {
      height: 150,
      width: 220,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    if (this.props.id) {
      return (
        <Player
          videoId={this.props.id}
          opts={opts}
          onEnd={this.props.onEnd}
          onReady={e => this.props.onReady(e.target)}>
        </Player>
      );
    }
    return <div></div>;
  }
}