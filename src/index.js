import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { fromJS } from 'immutable';

import '../node_modules/normalize.css/normalize.css';
import './index.css';
import playerReducer from "./Player/reducer";
import Search from "./Containers/Search";
import { favoritesReducer, searchReducer } from "./Reducers/nodes";
import InputHandler from "./Containers/InputHandler/index";
import Favorites from "./Containers/Favorites";
import PlayerBottom from "./Player/PlayerBottom";
import { loadState, saveState } from "./localStorage";


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const combinedReducer = combineReducers({
  search: searchReducer,
  favorites: favoritesReducer,
  player: playerReducer
});

const favorites = {
  isFocused: true,
  nodes: fromJS(loadState())
};
const search = {
  isFocused: false,
  nodes: fromJS([])
};

let store = createStore(combinedReducer, { favorites, search }, enhancer);

store.subscribe(() => saveState(store.getState().favorites.nodes));

const render = (store) =>
  ReactDOM.render(
    <Provider store={store}>
      <InputHandler>
        <Search/>
        <Favorites/>
        <PlayerBottom/>
      </InputHandler>
    </Provider>,
    document.getElementById('root')
  );

render(store);