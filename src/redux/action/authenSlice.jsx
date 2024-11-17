import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
    // phone: null,
    // dob: null,
    // address: null,
    // role: null,
    // active: null,
};

export const authenSlice = createSlice({
    name: 'authen', //tên của reducer
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.user = { ...action.payload.user };
            state.isLoading = false;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = "";
            state.user = { userName: null, role: null, email: null };
            state.isLoading = false;
        },
    },
});

// Export các action để sử dụng trong component
// export const { setInfor, setNull } = userSlice.actions;
export const { login, logout } = authenSlice.actions;

// Export reducer để sử dụng trong store
export default authenSlice.reducer;
