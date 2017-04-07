import React, { Component } from 'react';
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import { moveRight } from "../Reducers/actions";


class App extends Component {
  componentDidMount() {
    const props = this.props;

    document.addEventListener('keydown', checkKey, false);

    function checkKey(e) {
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

  render() {
    return (
      <div>
        <Tree nodes={this.props.nodes} />
      </div>
    );
  }
}
const mapStateToProps = (nodes) => ({ nodes });

function mapDispatchToProps(dispatch) {
  return ({
    moveRight: () => dispatch(moveRight()),
    moveLeft: () => dispatch({ type: 'move_left' }),
    moveDown: () => dispatch({ type: 'move_down' }),
    moveUp: () => dispatch({ type: 'move_up' }),
    hideCurrent: () => dispatch({ type: 'hide' }),
  })
}
const ConnectedNode = connect(mapStateToProps, mapDispatchToProps)(App);
export default ConnectedNode;
