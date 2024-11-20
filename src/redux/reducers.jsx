import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import authenSlice from './action/authenSlice';
import staffSlice from './action/staffSlice';

const reducers = combineReducers({
    authen: authenSlice,
    staff: staffSlice,
});

export default reducers;
