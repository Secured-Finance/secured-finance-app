import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';
/*
  it is not used
  better to use redux-saga for side effects
*/
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk))
export default store
