import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import YoutubePlayer from "../Components/YoutubePlayer";
import { accentColor, primaryColor, queueWidth, secondaryColor } from "../constants";
import { Header } from "./Playlist";

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${queueWidth}px;
  border-left: 1px solid grey;
  textAlign: center;
`;
const Item = styled.div`
  borderLeft: ${props => props.isEven ? 'solid 5px ' + accentColor : 'none'};
  padding: 10px;
  backgroundColor: ${props => props.isEven ? primaryColor : secondaryColor};
  color: rgba(255, 255, 255, 0.8);
  boxSizing: border-box;
`

class Player extends React.PureComponent {
  setPlayer(player) {
    console.log(player);
  }

  renderItem = (item, index) => (
    <Item key={item.id} isEven={index % 2 === 0}>
      <div>{item.artistName} - {item.albumName}</div>
      <div>{item.trackName} - {item.youtubeId}
        {/*<small>04:20</small>*/}
      </div>
    </Item>
  );

  render() {
    const { player } = this.props;
    const firstLoadedItem = player.queue.filter(i => i.youtubeId)[0];
    const id = firstLoadedItem ? firstLoadedItem.youtubeId : null;
    return (
      <PlayerContainer>
        <Header>Queue</Header>
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
