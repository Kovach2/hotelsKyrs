import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import accountReducer from './accountSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
});

export default rootReducer;