import * as React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

const Box = styled.div`
  position: absolute;
  top: 10px;
  right: 250px;
  margin:0 auto;
  textAlign: center;
  width: 150px;
  height: 50px;
`;

const SearchBox = (props) => props.searchTerm ? (
  <Box>
    <b>Search: </b>{props.searchTerm}
  </Box>
) : null as any;

const mapStateToProps = ({filter}) => ({searchTerm: filter});

export default connect(mapStateToProps)(SearchBox);