import { combineReducers } from '@reduxjs/toolkit';
// Import reducer từ slice
import userSlice from './action/userSlice';


const reducers = combineReducers({
    user: userSlice
});

export default reducers;
