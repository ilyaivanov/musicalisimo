import * as React from 'react';
import * as _ from 'lodash';
import {bindActionCreators} from 'redux';
import styled from 'styled-components';
import {connect} from 'react-redux';
import Tree from '../Components/Tree';
import {findArtists} from '../services/lastfm';
import Tab from '../Components/Tab';
import Header from '../Components/Header';
import {findYoutubeVideos} from '../services/youtube';
import * as actions from './InputHandler/actions';

const Container = styled.div`
  margin: auto;
  width: 50%;
`;
const Input = styled.input`
  width: 100%;
` as any;

interface MyState {
  searchTerm: string;
  input?: JSX.Element;
}

interface Props {
  search: any;
}

class Search extends React.PureComponent<any, MyState> {
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
      (this.state.input as any).focus();
    } else {
      if (document.activeElement) {
        setTimeout(() => (document.activeElement as any).blur());
      }
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
            innerRef={(input: any) => this.setState({input})}
            onClick={(e: any) => this.handle(e)}
            initialValue={this.state.searchTerm as any}
            onChange={(e: any) => this.updateTerm(e.currentTarget.value)}
          />
        </Container>
        <Tree
          filter={this.props.filter}
          nodes={this.props.search.nodes.toJS()}
          onNodeTextChange={this.props.updateNodeText}
          showSelected={this.props.search.isFocused}
          onSetContext={this.props.onSetContext}
          showNodeById={id => this.props.showNodeById(id)}
          hideNodeById={id => this.props.hideNodeById(id)}
        />
      </Tab>
    );
  }
}

const mapStateToProps = ({search, filter}) => ({search, filter});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions as any, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Search);