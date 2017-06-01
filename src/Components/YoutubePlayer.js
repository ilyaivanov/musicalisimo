import React from 'react';
import styled from 'styled-components';
import Youtube from 'react-youtube';
import { footerHeight } from "../constants";

const Player = styled(Youtube)`
  position: absolute;
  right: 15px;
  bottom: ${footerHeight + 15}px;
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