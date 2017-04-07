import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import App from './Containers/App';
import nodesReducer from './Reducers/nodes';

import '../node_modules/normalize.css/normalize.css';
import './index.css';


const store = createStore(nodesReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
