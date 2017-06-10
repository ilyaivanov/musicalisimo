import * as React from 'react';
import * as _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {returntypeof} from 'react-redux-typescript';

import {Container, Input} from './styles';
import Tree from '../../Components/Tree/Tree';
import Tab from '../../Components/Tab';
import Header from '../../Components/Header';
import * as actions from '../InputHandler/actions';
import {findArtists} from '../../services/lastfm';
import {findYoutubeVideos} from '../../services/youtube';
import {AppState} from '../../types';

const mapStateToProps = ({search, filter}: AppState) => ({search, filter});

// bindActionCreators doesn't recognize import * as actions, so using as any here
const mapDispatchToProps = (dispatch) => bindActionCreators(actions as any, dispatch);

const stateProps = returntypeof(mapStateToProps);
type Props = typeof actions & typeof stateProps;

interface MyState {
  searchTerm: string;
  input?: HTMLElement;
}

class Search extends React.PureComponent<Props, MyState> {
  updateTerm =
    _.debounce(
      (searchTerm: string) => {
        this.setState({searchTerm});
        if (searchTerm) {
          findArtists(searchTerm)
            .then(this.props.artistLoaded);

          findYoutubeVideos(searchTerm)
            .then(this.props.youtubeLoaded);
        }
      },
      500);

  constructor() {
    super();

    this.state = {
      searchTerm: ''
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.search.isSearchFieldFocused && this.state.input) {
      this.state.input.focus();
    } else {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }
  }

  handle = (e: MouseEvent) => {
    this.props.selectSearchTerm();
    e.preventDefault();
    e.stopPropagation();
  }

  renderHiddenTab() {
    return (
      <Tab
        isHidden={true}
        isFocused={this.props.search.isFocused}
        onClick={this.props.selectSearch}
      >
        <Header isVertical={true}>Search</Header>
      </Tab>
    );
  }

  render() {
    if (!this.props.search.isFocused) {
      return this.renderHiddenTab();
    }

    return (
      <Tab
        isFocused={this.props.search.isFocused}
        onClick={this.props.selectSearch}
      >
        <Header>Search results for '{this.state.searchTerm}'</Header>
        <Container>
          <Input
            type="text"
            innerRef={input => this.setState({input})}
            onClick={(e: any) => this.handle(e)}
            initialValue={this.state.searchTerm as any}
            onChange={(e: any) => this.updateTerm(e.currentTarget.value)}
          />
        </Container>
        <Tree
          isClean={true}
          filter={this.props.filter}
          nodes={this.props.search.nodes.toJS()}
          onNodeTextChange={this.props.updateNodeText}
          showSelected={this.props.search.isFocused}
          showNodeById={id => this.props.showNodeById(id)}
          hideNodeById={id => this.props.hideNodeById(id)}
          onNodeIconClick={() => console.log('setting context in search is not supported')}
        />
      </Tab>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);