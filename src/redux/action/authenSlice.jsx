import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
};

export const authenSlice = createSlice({
    name: 'authen', //tên của reducer
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

// Export các action để sử dụng trong component
// export const { setInfor, setNull } = userSlice.actions;
export const { login, logout, setInformation } = authenSlice.actions;

// Export reducer để sử dụng trong store
export default authenSlice.reducer;
