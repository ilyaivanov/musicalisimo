import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {Provider, Store} from 'react-redux';
import {fromJS} from 'immutable';

import '../node_modules/normalize.css/normalize.css';
import './index.css';
import playerReducer from './Player/reducer';
import filter from './Containers/NodesFilter/reducer';
import Search from './Containers/Search';
import SearchBox from './Containers/NodesFilter/SearchBox';
import {defaultSearchNodes, favoritesReducer, searchReducer} from './Reducers/nodes';
import InputHandler from './Containers/InputHandler/index';
import Favorites from './Containers/Favorites';
import PlayerBottom from './Player/PlayerBottom';
import {loadState, saveState} from './localStorage';
import registerServiceWorker from './registerServiceWorker';
import '../node_modules/font-awesome/css/font-awesome.min.css';

registerServiceWorker();

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const combinedReducer = combineReducers({
  search: searchReducer,
  favorites: favoritesReducer,
  filter,
  player: playerReducer
});

const favorites = {
  isFocused: true,
  nodes: fromJS(loadState())
} as any;
const search = {
  isFocused: false,
  nodes: fromJS(defaultSearchNodes())
} as any;

let store = createStore(combinedReducer, ({favorites, search} as any), enhancer);

store.subscribe(() => saveState(store.getState().favorites.nodes));

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
