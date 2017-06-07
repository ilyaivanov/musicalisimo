import * as React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import YoutubePlayer from '../Components/YoutubePlayer';
import {footerHeight} from '../constants';
import {playNextTrack} from './actions';

const PlayerContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: ${footerHeight}px;
  background-color: #efefef;
  text-align: center;
  verticalAlign: middle;
  visible: hidden;
`;

const Image = styled.img`
  position: fixed;
  bottom:0;
  ${(props: any) => props.left ? 'left: 0;' : 'right:0;'}
` as any;

class Player extends React.PureComponent<any, any> {
  setPlayer(player: any) {
    // console.log(player);
  }

  render() {
    const {
      player: {
        currentArtist,
        currentAlbum,
        currentTrack,
        artistImage,
        albumImage,
        video,
      },
      playNextTrack,
    } = this.props;
    return (
      <PlayerContainer>
        <Image left={true} src={artistImage}/>
        <div>{currentArtist} - {currentAlbum} - {currentTrack}</div>
        <div>{video ? video.title : ''}</div>
        <Image right={true} src={albumImage}/>
        <YoutubePlayer
          visible={this.props.youtubeVisible}
          id={video ? video.id : null}
          onReady={this.setPlayer}
          onEnd={playNextTrack}
        />
      </PlayerContainer>
    );
  }
}

const mapStateToProps = (props: any) => ({
  player: props.player,
  youtubeVisible: props.userSettings.youtubeVisible
});

const mapDispatch = {playNextTrack};

export default connect(mapStateToProps, mapDispatch)(Player);
