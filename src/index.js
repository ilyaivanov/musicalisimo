import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import styled from 'styled-components';
import { fromJS } from 'immutable';

import '../node_modules/normalize.css/normalize.css';
import './index.css';
import Player from "./Containers/Player";
import playerReducer from "./Reducers/playerReducer";
import Playlist from "./Containers/Playlist";
import favoritesReducer from "./Reducers/favoritesReducer";
import InputHandler from "./Containers/InputHandler/index";


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const combinedReducer = combineReducers({
  favorites: favoritesReducer,
  player: playerReducer
});

// const favorites = localStorage.getItem('musicalisimoFavorites') ? JSON.parse(localStorage.getItem('musicalisimoFavorites')) : favoritesInitialState;

const basicnodes = fromJS([]);

const favorites = {
  isFocused: true,
  nodes: basicnodes
};

let store = createStore(combinedReducer, { favorites }, enhancer);
// try {
//   store =
// } catch (e) {
//   console.log('Error appeared when retrieving state from local storage. Running with default');
//   store = createStore(combinedReducer, enhancer);
// }
//
// store.subscribe(() => {
//   localStorage.setItem('musicalisimoFavorites', JSON.stringify(store.getState().favorites))
// });

const Container = styled.div`
  display: flex;
`;

const render = (store) =>
  ReactDOM.render(
    <Provider store={store}>
      <Container>
        <InputHandler>
          {/*<App />*/}
          <Playlist/>
          {/*<Player />*/}
        </InputHandler>
      </Container>
    </Provider>,
    document.getElementById('root')
  );

render(store);