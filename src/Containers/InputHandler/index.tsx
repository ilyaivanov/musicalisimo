import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './actions';
import * as playerActions from '../../Player/actions';
import * as filterActions from '../NodesFilter/actions';
import {filterEnabled} from '../../featureFlags';
import ShortcutsBox from '../../Components/ShortcutsGuide';

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const TAB_KEY = 9;
const SPACE_KEY = 32;
// const D_KEY = 68;
const S_KEY = 83;
const R_KEY = 82;
const ENTER_KEY = 13;
const ESC_KEY = 27;
const DELETE_KEY = 46;
const F2_KEY = 113;
const SLASH_KEY = 191;

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
      } else if (e.keyCode === ESC_KEY) {
        props.stopEditNode();
      } else if (e.keyCode === ENTER_KEY) {
        props.handleEnter();
      }

      if (document.activeElement.tagName === 'BODY') {
        e = e || window.event;
        if (e.altKey && e.shiftKey && e.keyCode === LEFT_KEY) {
          props.defaultAction(props.swapNodeLeft);
        } else if (e.altKey && e.shiftKey && e.keyCode === RIGHT_KEY) {
          props.defaultAction(props.handleNodeSwappingRight);
        } else if (e.altKey && e.shiftKey && e.keyCode === UP_KEY) {
          props.defaultAction(props.swapNodeUp);
        } else if (e.altKey && e.shiftKey && e.keyCode === DOWN_KEY) {
          props.defaultAction(props.swapNodeDown);
        } else if (e.keyCode === LEFT_KEY) {
          props.defaultAction(props.moveLeft);
        } else if (e.keyCode === RIGHT_KEY) {
          props.defaultAction(props.moveRight);
        } else if (e.keyCode === UP_KEY) {
          props.defaultAction(props.moveUp);
          e.preventDefault();
        } else if (e.keyCode === DOWN_KEY) {
          props.defaultAction(props.moveDown);
          e.preventDefault();
        } else if (e.ctrlKey && e.keyCode === ENTER_KEY) {
          props.addNodeToFavorites();
        } else if (e.altKey && e.keyCode === S_KEY) {
          props.toggleYoutube();
        } else if (e.altKey && e.keyCode === R_KEY) {
          props.refreshSelectedNode();
        } else if (e.ctrlKey && e.keyCode === SLASH_KEY) {
          props.toggleShortcuts();
        } else if (e.altKey && e.keyCode === ENTER_KEY) {
          props.createContext();
        } else if (e.keyCode === ESC_KEY) {
          props.dismissOnBody();
        } else if (e.keyCode === SPACE_KEY) {
          props.play();
          e.preventDefault();
        } else if (e.keyCode === DELETE_KEY) {
          props.deleteNode();
        } else if (e.keyCode === F2_KEY) {
          props.startEditNode();
        } else if (e.keyCode >= 65 && e.keyCode <= 90 && filterEnabled) {
          props.addLetterToSearch(String.fromCharCode(e.keyCode).toLowerCase());
        }
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
        {this.props.userSettings.shortcutsVisible && <ShortcutsBox/>}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({...actions, ...filterActions, ...playerActions}, dispatch);

const mapStateToProps = (state) => ({userSettings: state.userSettings});

export default connect(mapStateToProps, mapDispatchToProps)(InputHandler);