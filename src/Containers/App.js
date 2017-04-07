import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import { lookForArtists, moveRight } from "../Reducers/actions";


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
      console.log(document.activeElement, document.activeElement.tagName);
      if (document.activeElement.tagName === 'BODY') {
        e = e || window.event;
        if (e.keyCode === 38)
          props.moveUp();
        else if (e.keyCode === 40)
          props.moveDown();
        else if (e.keyCode === 32)
          props.hideCurrent();
        else if (e.keyCode === 37)
          props.moveLeft();
        else if (e.keyCode === 39)
          props.moveRight();
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
      <div>
        <input type="text"
               value={this.state.searchTerm}
               onChange={this.update}/>
        <Tree nodes={this.props.nodes}/>
      </div>
    );
  }
}
const mapStateToProps = (nodes) => ({ nodes });

function mapDispatchToProps(dispatch) {
  return ({
    moveRight: () => dispatch(moveRight()),
    lookForArtists: (term) => dispatch(lookForArtists(term)),
    moveLeft: () => dispatch({ type: 'move_left' }),
    moveDown: () => dispatch({ type: 'move_down' }),
    moveUp: () => dispatch({ type: 'move_up' }),
    hideCurrent: () => dispatch({ type: 'hide' }),
  })
}
const ConnectedNode = connect(mapStateToProps, mapDispatchToProps)(App);
export default ConnectedNode;
