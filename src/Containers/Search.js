import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import Tree from "../Components/Tree";
import { connect } from "react-redux";
import { findArtists } from "../services/lastfm";
import { artistLoaded, selectSearch, selectSearchTerm } from "./actions";
import Tab from "../Components/Tab";
import Header from "../Components/Header";

const Container = styled.div`
  margin: auto;
  width: 50%;
`;
const Input = styled.input`
  width: 100%;
`;
class Search extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      input: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.isSearchFieldFocused)
      this.state.input.focus();
    else {
      if (document.activeElement)
        setTimeout(() => document.activeElement.blur());
    }
  }

  updateTerm = _.debounce((searchTerm) => {
      this.setState({ searchTerm });
      findArtists(searchTerm)
        .then(this.props.artistLoaded);
    }
    , 500);

  handle(e) {
    this.props.selectSearchTerm();
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return (
      <Tab
        isFocused={this.props.search.isFocused}
        onClick={this.props.selectSearch}>
        <Header>Search results for '{this.state.searchTerm}'</Header>
        <Container>
          <Input
            type="text"
            innerRef={input => this.setState({ input })}
            onClick={this.handle.bind(this)}
            initialValue={this.state.searchTerm}
            onChange={e => this.updateTerm(e.currentTarget.value)}
          />
        </Container>
        <Tree nodes={this.props.search.nodes.toJS()}/>
      </Tab>
    );
  }
}

const mapStateToProps = ({ search }) => ({ search });

const mapDispatchToProps = { artistLoaded, selectSearch, selectSearchTerm };

export default connect(mapStateToProps, mapDispatchToProps)(Search);