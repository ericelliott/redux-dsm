import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers';
import { App } from './components';
import thunkMiddleware from 'redux-thunk';
import { fetchCommits } from './actions';


const store = createStore(rootReducer, applyMiddleware(
    thunkMiddleware
));

store.dispatch(fetchCommits());

render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')
);
