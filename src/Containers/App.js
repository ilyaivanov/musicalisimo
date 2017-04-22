import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import {
  addSelectedItemToFavorites,
  lookForArtists,
  moveRight,
  focusFavorites,
  focusSearch, moveSelectedNodeRight, createPlaylist
} from "../Reducers/actions";
import { addSelectedItemToQueue } from "../Reducers/playerActions";
import { Header } from "./Playlist";
import styled from 'styled-components';

const SearchContainer = styled.div`
  width: 50%;
  height: 100vh;
  boxSizing: border-box;
  ${props => props.isFocused && 'border: 2px solid black;'}
  ${props => !props.isFocused && 'display: none;'}
`;
const DOWN_KEY = 40;
const UP_KEY = 38;
const TAB_KEY = 9;

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: ''
    };
  }

  componentDidMount() {
    const props = this.props;

    document.addEventListener('keydown', checkKey);

    function checkKey(e) {
      // const swallowedKeys = [TAB_KEY, UP_KEY, DOWN_KEY];
      if(!e.shiftKey && e.keyCode === TAB_KEY){
        e.preventDefault();
      }
      if (document.activeElement.tagName === 'INPUT' && e.keyCode === TAB_KEY) {
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
      if (document.activeElement.tagName === 'BODY') {
        e = e || window.event;
        if (e.shiftKey && e.altKey && e.keyCode === UP_KEY)
          props.moveNodeUp();
        else if (e.shiftKey && e.altKey && e.keyCode === DOWN_KEY)
          props.moveNodeDown();
        else if (e.keyCode === UP_KEY)
          props.moveUp();
        else if (e.keyCode === DOWN_KEY)
          props.moveDown();
        else if (e.keyCode === 68) // D
          props.addSelectedItemToFavorites();
        else if (e.ctrlKey && e.shiftKey && e.keyCode === 8) // Backspace
          props.deleteSelectedNode();
        else if (e.keyCode === 32)
          props.addSelectedItemToQueue();
        else if (e.keyCode === 37)
          props.moveLeft();
        else if (e.altKey && e.shiftKey && e.keyCode === 39) {
          console.log('moveSelectedNodeRight');
          props.moveSelectedNodeRight();
        } else if (e.keyCode === 13)
          props.createPlaylist();
        else if (e.keyCode === 39)
          props.moveRight();
        else if (e.altKey && e.keyCode === 49)  // 1
          props.focusSearch();
        else if (e.altKey && e.keyCode === 50)  // 2
          props.focusFavorites();
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
    moveNodeUp: () => dispatch({ type: 'move_node_up' }),
    moveNodeDown: () => dispatch({ type: 'move_node_down' }),
    deleteSelectedNode: () => dispatch({ type: 'delete_selected' }),
    addSelectedItemToQueue: () => dispatch(addSelectedItemToQueue()),
    addSelectedItemToFavorites: () => dispatch(addSelectedItemToFavorites()),
    focusSearch: () => dispatch(focusSearch()),
    focusFavorites: () => dispatch(focusFavorites()),
    moveSelectedNodeRight: () => dispatch(moveSelectedNodeRight()),
    createPlaylist: () => dispatch(createPlaylist()),
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
