import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    current: "1",
};

export const webSlice = createSlice({
    name: 'web', //tên của reducer
    initialState,
    reducers: {
        setCurrent: (state, action) => {
            return action.payload;
        },
        removeCurrent: (state) => {
            return { ...initialState }; // Trả về trạng thái ban đầu
        }
    },
});

// Export các action để sử dụng trong component
// export const { setInfor, setNull } = userSlice.actions;
export const { setCurrent, removeCurrent } = webSlice.actions;

// Export reducer để sử dụng trong store
export default webSlice.reducer;
