import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import {
  addSelectedItemToFavorites,
  lookForArtists,
  moveRight,
  focusFavorites,
  focusSearch
} from "../Reducers/actions";
import { addSelectedItemToQueue } from "../Reducers/playerActions";
import { Header } from "./Playlist";
import styled from 'styled-components';

const SearchContainer = styled.div`
  width: 50%;
  height: 100vh;
  boxSizing: border-box;
  ${props => props.isFocused && 'border: 2px solid black;'}
`;


class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: ''
    };
  }

  componentDidMount() {
    const props = this.props;

    document.addEventListener('keydown', checkKey, false);

    function checkKey(e) {
      if (document.activeElement.tagName === 'INPUT' && e.keyCode === 9) {
        // Give the document focus
        window.focus();

        // Remove focus from any focused element
        if (document.activeElement) {
          document.activeElement.blur();
        }

        // temporary solution for better testing
        // emulate move down because if none is selected - first node will be selected
        // this won't work
        props.moveDown();

      }

      console.log(e.keyCode);
      if (document.activeElement.tagName === 'BODY') {
        e = e || window.event;
        if (e.keyCode === 38)
          props.moveUp();
        else if (e.keyCode === 40)
          props.moveDown();
        else if (e.keyCode === 81) // D
          props.addSelectedItemToFavorites();
        else if (e.keyCode === 32)
          props.addSelectedItemToQueue();
        else if (e.keyCode === 37)
          props.moveLeft();
        else if (e.keyCode === 39)
          props.moveRight();
        else if (e.altKey && e.keyCode === 49)  // 1
          props.focusSearch();
        else if (e.altKey && e.keyCode === 50)  // 2
          props.focusFavorites();
        e.preventDefault();
      }
    }
  }

  search = debounce(term => this.props.lookForArtists(term), 500);

  update = (e) => {
    let searchTerm = e.currentTarget.value;
    this.setState({ searchTerm });
    this.search(searchTerm);
  };

  render() {
    return (
      <SearchContainer isFocused={this.props.search.isFocused}>
        <Header>Search</Header>
        <input type="text"
               autoFocus
               value={this.state.searchTerm}
               onChange={this.update}/>
        <Tree nodes={this.props.search.nodes}/>
      </SearchContainer>
    );
  }
}
const mapStateToProps = ({ search }) => ({ search });

function mapDispatchToProps(dispatch) {
  return ({
    lookForArtists: (term) => dispatch(lookForArtists(term)),
    moveRight: () => dispatch(moveRight()),
    moveLeft: () => dispatch({ type: 'move_left' }),
    moveDown: () => dispatch({ type: 'move_down' }),
    moveUp: () => dispatch({ type: 'move_up' }),
    addSelectedItemToQueue: () => dispatch(addSelectedItemToQueue()),
    addSelectedItemToFavorites: () => dispatch(addSelectedItemToFavorites()),
    focusSearch: () => dispatch(focusSearch()),
    focusFavorites: () => dispatch(focusFavorites()),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
