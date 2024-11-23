import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
};

export const authenSlice = createSlice({
    name: 'authen',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.user = { ...action.payload.user };
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.user = null;
        },
        setInformation: (state, action) => {
            state.user = { ...action.payload };
        },
    },
});

export const { login, logout, setInformation } = authenSlice.actions;
export default authenSlice.reducer;