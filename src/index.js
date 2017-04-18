import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import styled from 'styled-components';

import App from './Containers/App';

import '../node_modules/normalize.css/normalize.css';
import './index.css';
import Player from "./Containers/Player";
import playerReducer from "./Reducers/playerReducer";
import Playlist from "./Containers/Playlist";
import favoritesReducer, { favoritesInitialState } from "./Reducers/favoritesReducer";
import searchReducer from "./Reducers/searchReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const combinedReducer = combineReducers({
  search: searchReducer,
  favorites: favoritesReducer,
  player: playerReducer
});

const favorites = localStorage.getItem('musicalisimoFavorites') ? JSON.parse(localStorage.getItem('musicalisimoFavorites')) : favoritesInitialState;

const store = createStore(combinedReducer, { favorites }, enhancer);

store.subscribe(() => {
  localStorage.setItem('musicalisimoFavorites', JSON.stringify(store.getState().favorites))
});
const Container = styled.div`
  display: flex;
`;

ReactDOM.render(
  <Provider store={store}>
    <Container>
      <App />
      <Playlist/>
      <Player />
    </Container>
  </Provider>,
  document.getElementById('root')
);
