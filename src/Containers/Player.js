import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import YoutubePlayer from "../Components/YoutubePlayer";

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 285px;
  border-left: 1px solid grey;
  textAlign: center;
`;


class Player extends React.PureComponent {
  setPlayer(player) {
    console.log(player);
  }

  renderItem = item => (
    <div key={item.id}>
      <div>{item.artistName} - {item.albumName}</div>
      <div>{item.trackName} - {item.youtubeId ? 'current' : 'waiting'}
        {/*<small>04:20</small>*/}
      </div>
    </div>
  );

  render() {
    const { player } = this.props;
    const firstLoadedItem = player.queue.filter(i => i.youtubeId)[0];
    const id = firstLoadedItem? firstLoadedItem.youtubeId : null;
    return (
      <PlayerContainer>
        <h3>Queue</h3>
        {player.queue.map(this.renderItem)}
        <YoutubePlayer
          id={id}
          onReady={this.setPlayer}
        />
      </PlayerContainer>
    );
  }
}

const mapStateToProps = ({ player }) => ({ player });


export default connect(mapStateToProps)(Player);
