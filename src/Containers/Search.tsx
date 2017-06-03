import * as React from 'react';
import * as _ from 'lodash';
import styled from 'styled-components';
import {connect} from 'react-redux';
import Tree from '../Components/Tree';
import {findArtists} from '../services/lastfm';
import {artistLoaded, selectSearch, selectSearchTerm} from './actions';
import Tab from '../Components/Tab';
import Header from '../Components/Header';

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
        findArtists(searchTerm)
          .then(this.props.artistLoaded);
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

  render() {
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
        <Tree nodes={this.props.search.nodes.toJS()}/>
      </Tab>
    );
  }
}

const mapStateToProps = (props: Props) => ({search: props.search});

const mapDispatchToProps = {artistLoaded, selectSearch, selectSearchTerm};

export default connect(mapStateToProps, mapDispatchToProps)(Search);