import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import authenSlice from './action/authenSlice';

const reducers = combineReducers({
    authen: authenSlice,
});

export default reducers;
