import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import authReducer from './authReducer';
import experienceReducer from './experienceReducer';

const createRootReducer = (history) =>
  combineReducers({
    authReducer,
    experienceReducer,
    router: connectRouter(history),
  });
export default createRootReducer;
