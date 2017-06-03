import * as React from 'react';
import styled from 'styled-components';

import {footerHeight} from '../constants';
import Youtube from 'react-youtube';

const Player = styled(Youtube)`
  position: absolute;
  right: 15px;
  bottom: ${footerHeight + 15}px;
` as any;

export default class YoutubePlayer extends React.PureComponent<any, any> {
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
          onReady={(e: any) => this.props.onReady(e.target)}
        >
          <div>1</div>
        </Player>
      );
    }
    return <div>2</div>;
  }
}