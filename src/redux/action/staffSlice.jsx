import { createSlice } from '@reduxjs/toolkit';


//khởi tạo state ban đầu
const initialState = {
    user_id: null,
    position: null,
    salary: 0,
    type: null,
    status: null,
    _id: null,
    username: null,
    role: null,
    first_name: null,
    last_name: null,
    email: null,
    cid: null,
    address: null,
    phone_number: null,
    avatar: null,
};

export const staffSlice = createSlice({
    name: 'staff', //tên của reducer
    initialState,
    reducers: {
        removeStaffInfor: (state) => {
            return { ...initialState }; // Trả về trạng thái ban đầu
        },
        setStaffInfor: (state, action) => {
            return { ...action.payload }; // Cập nhật toàn bộ state
        },
    },
});

// Export các action để sử dụng trong component
// export const { setInfor, setNull } = userSlice.actions;
export const { removeStaffInfor, setStaffInfor } = staffSlice.actions;

// Export reducer để sử dụng trong store
export default staffSlice.reducer;
