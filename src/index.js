import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import styled from 'styled-components';

import App from './Containers/App';
import nodesReducer from './Reducers/nodes';

import '../node_modules/normalize.css/normalize.css';
import './index.css';
import Player from "./Containers/Player";
import playerReducer from "./Reducers/playerReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const combinedReducer = combineReducers({ nodes: nodesReducer, player: playerReducer });
const store = createStore(combinedReducer, enhancer);

const Container = styled.div`
  display: flex;
`;

ReactDOM.render(
  <Provider store={store}>
    <Container>
      <App />
      <Player />
    </Container>
  </Provider>,
  document.getElementById('root')
);
