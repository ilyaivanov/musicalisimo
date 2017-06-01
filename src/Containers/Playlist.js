import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { queueWidth } from "../constants";
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import { findArtists } from "../services/lastfm";
import { artistLoaded } from "./actions";

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  borderLeft: 1px solid grey;
`;
export const Header = styled.h2`
  textAlign: center;
`;

const Container = styled.div`
  margin: auto;
  width: 50%;
`;
const Input = styled.input`
  width: 100%;
`;
class Favorites extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };
  }

  updateTerm = _.debounce((searchTerm) => {
      this.setState({ searchTerm });
      findArtists(searchTerm)
        .then(this.props.onArtistsLoad);
    }
    , 500);

  render() {
    return (
      <PlayerContainer isFocused={this.props.favorites.isFocused}>
        <Header>Search results for '{this.state.searchTerm}'</Header>
        <Container>
          <Input
            type="text"
            autoFocus
            initialValue={this.state.searchTerm}
            onChange={e => this.updateTerm(e.currentTarget.value)}
          />
        </Container>
        <Tree nodes={this.props.favorites.nodes.toJS()}/>
      </PlayerContainer>
    );
  }
}

const mapStateToProps = ({ favorites }) => ({ favorites });


const mapDispatchToProps = {
  onArtistsLoad: artistLoaded,
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);