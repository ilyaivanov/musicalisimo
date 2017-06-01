import React from 'react';
import { connect } from 'react-redux';
import { addNodeToFavorites, moveDown, moveLeft, moveRight, moveUp } from './actions';
import { play } from "../../Player/actions";

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const TAB_KEY = 9;
const SPACE_KEY = 32;
const D_KEY = 68;
const ENTER_KEY = 13;

class InputHandler extends React.Component {

  componentDidMount() {
    const props = this.props;

    document.addEventListener('keydown', checkKey);

    function checkKey(e) {
      if (e.keyCode === TAB_KEY) {
        e.preventDefault();
      }
      if (document.activeElement.tagName === 'BODY') {
        e = e || window.event;
        if (e.keyCode === LEFT_KEY)
          props.moveLeft();
        else if (e.keyCode === RIGHT_KEY)
          props.moveRight();
        else if (e.keyCode === UP_KEY)
          props.moveUp();
        else if (e.keyCode === DOWN_KEY)
          props.moveDown();
        else if (e.ctrlKey && e.keyCode === ENTER_KEY)
          props.addNodeToFavorites();
        else if (e.keyCode === SPACE_KEY)
          props.play();
      }
    }
  }

  render() {
    return (<div>
      {this.props.children}
    </div>);
  }
}

const mapDispatchToProps = { moveLeft, moveRight, moveDown, moveUp, addNodeToFavorites, play };

export default connect(null, mapDispatchToProps)(InputHandler);