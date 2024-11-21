import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import authenSlice from './action/authenSlice';
import staffSlice from './action/staffSlice';
import webSlice from './action/webSlice';

const reducers = combineReducers({
    authen: authenSlice,
    staff: staffSlice,
    web: webSlice,
});

export default reducers;
