import * as React from 'react';
import {connect} from 'react-redux';
import {
  addNodeToFavorites, deleteNode, moveDown, moveLeft, moveRight, moveUp, swapNodeDown, swapNodeLeft,
  swapNodeRight, swapNodeUp,
} from './actions';
import {play} from '../../Player/actions';
import {selectFavorites, selectSearch, selectSearchTerm} from '../actions';

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const TAB_KEY = 9;
const SPACE_KEY = 32;
// const D_KEY = 68;
const ENTER_KEY = 13;
// const ESC_KEY = 27;
const DELETE_KEY = 46;

const ONE_KEY = 49;
const TWO_KEY = 50;
const THREE_KEY = 51;

class InputHandler extends React.Component<any, any> {

  componentDidMount() {
    const props = this.props;

    document.addEventListener('keydown', checkKey);

    function checkKey(e: KeyboardEvent) {
      if (e.keyCode === TAB_KEY) {
        e.preventDefault();
      }
      console.log(e.keyCode);
      if (e.altKey && e.keyCode === ONE_KEY) {
        props.selectSearchTerm();
      } else if (e.altKey && e.keyCode === TWO_KEY) {
        props.selectSearch();
      } else if (e.altKey && e.keyCode === THREE_KEY) {
        props.selectFavorites();
      }

      if (document.activeElement.tagName === 'BODY') {
        e = e || window.event;
        if (e.altKey && e.shiftKey && e.keyCode === LEFT_KEY) {
          props.swapNodeLeft();
        } else if (e.altKey && e.shiftKey && e.keyCode === RIGHT_KEY) {
          props.swapNodeRight();
        } else if (e.altKey && e.shiftKey && e.keyCode === UP_KEY) {
          props.swapNodeUp();
        } else if (e.altKey && e.shiftKey && e.keyCode === DOWN_KEY) {
          console.log('swapNodeDown');
          props.swapNodeDown();
        } else if (e.keyCode === LEFT_KEY) {
          props.moveLeft();
        } else if (e.keyCode === RIGHT_KEY) {
          props.moveRight();
        } else if (e.keyCode === UP_KEY) {
          props.moveUp();
        } else if (e.keyCode === DOWN_KEY) {
          props.moveDown();
        } else if (e.ctrlKey && e.keyCode === ENTER_KEY) {
          props.addNodeToFavorites();
        } else if (e.keyCode === SPACE_KEY) {
          props.play();
        } else if (e.keyCode === DELETE_KEY) {
          props.deleteNode();
        }
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = {
  moveLeft,
  moveRight,
  moveDown,
  moveUp,
  addNodeToFavorites,
  play,
  selectSearch,
  selectFavorites,
  selectSearchTerm,
  deleteNode,
  swapNodeLeft,
  swapNodeRight,
  swapNodeUp,
  swapNodeDown,

};

export default connect(null, mapDispatchToProps)(InputHandler);