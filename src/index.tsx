import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {Provider, Store} from 'react-redux';
import {fromJS} from 'immutable';

import defaultFav from './Playlits/defaultPlaylists';
import '../node_modules/normalize.css/normalize.css';
import './index.css';
import playerReducer from './Player/reducer';
import filter from './Containers/NodesFilter/reducer';
import userSettings from './Reducers/userConfiguration';
import Search from './Containers/Search';
import SearchBox from './Containers/NodesFilter/SearchBox';
import {defaultSearchNodes, favoritesReducer, searchReducer} from './Reducers/nodes';
import InputHandler from './Containers/InputHandler/index';
import Favorites from './Containers/Favorites';
import PlayerBottom from './Player/PlayerBottom';
import {loadState, saveState} from './localStorage';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/font-awesome-animation/dist/font-awesome-animation.min.css';

registerServiceWorker();

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const combinedReducer = combineReducers({
  search: searchReducer,
  favorites: favoritesReducer,
  filter,
  userSettings,
  player: playerReducer
});

const favorites = {
  isFocused: true,
  nodes: fromJS(loadState('favoriteNodes', defaultFav))
} as any;

const search = {
  isFocused: false,
  nodes: fromJS(defaultSearchNodes())
} as any;

const state = {
  favorites,
  search,
  userSettings: loadState('userSettings')
};

let store = createStore(combinedReducer, (state as any), enhancer);

store.subscribe(
  _.throttle(
    () => {
      saveState(store.getState().favorites.nodes, 'favoriteNodes');
      saveState(store.getState().userSettings, 'userSettings');
    },
    500)
);

const render = (s: Store<any>) =>
  ReactDOM.render(
    <Provider store={s}>
      <InputHandler>
        <Search/>
        <Favorites/>
        <PlayerBottom/>
        <SearchBox/>
      </InputHandler>
    </Provider>,
    document.getElementById('root')
  );

render(store);
