import axios from "axios";
import clientApi from "../client-api/rest-client-api";
//handle api for staff
const token = localStorage.getItem('token')
//api create user
const createUser = async (user) => {
  try {
    return await clientApi
      .service('/register')
      .create(user);
  } catch (error) {
    console.error('Không thể thêm người dùng mới:', error);
    throw error;
  }
}
const getAllStaffApi = async (params = {}) => {
  try {
    return await clientApi
      .service('/staff')
      .find({
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || ''
      });
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
}
const updateStaff = async (staffId, staffInfo) => {
  try {
    return await clientApi
      .service('/staff')
      .put(staffId, staffInfo);
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
}
const addStaff = async (staffInfo) => {
  try {
    return await clientApi
      .service('/staff')
      .create(staffInfo);
  } catch (error) {
    console.error('Error adding staff:', error);
    throw error;
  }
}
const deleteStaff = async (staffId) => {
  try {
    return await clientApi
      .service('/staff')
      .delete(staffId);
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
}
//Ingredient
const getAllIngredientApi = async (params = {}) => {
  try {
    // Tạo query parameters
    const query = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    // Thêm các tham số tìm kiếm nếu có
    if (params.name) query.name = params.name;
    if (params.type) query.type = params.type;
    if (params.status) query.status = params.status;

    // Gửi yêu cầu đến API
    return await clientApi
      .service('/ingredients')
      .find(query);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};


const searchBooking = async (obj) => {
  // const queryString = new URLSearchParams(obj).toString();
  return clientApi.service("booking/staff").find(obj);
}
const serveBooking = async (id, data) => {
  return clientApi.service("booking/serve").put(id, data);
}
const addOrderDetail = async (id, data) => {
  return clientApi.service("order").put(id, data);
}

//api for recruitment
export const getAllRecruitmentApi = async (params = {}) => {
  try {
    return await clientApi
      .service('/recruitment')
      .find({
        page: params.page || 1,
        limit: params.pageSize || 10,
        search: params.search || ''
      });
  } catch (error) {
    console.error('Error fetching recruitment:', error);
    throw error;
  }
}
export const createRecruitment = async (data) => {
  try {
    return await clientApi
      .service('/recruitment')
      .create(data);
  } catch (error) {
    console.error('Không thể thêm mới tuyển dụng:', error);
    throw error;
  }
}

export const updateRecruitment = async (id, data) => {
  try {
    return await clientApi
      .service('/recruitment')
      .put(id, data);
  } catch (error) {
    console.error('Error updating recruitment:', error);
    throw error;
  }
}
export const getRecruitmentById = async (id) => {
  try {
    return await clientApi
      .service('/recruitment')
      .get(id);
  } catch (error) {
    console.error('Error fetching recruitment:', error);
    throw error;
  }
}
export const deleteRecruitment = async (recruitmentId) => {
  try {
    return await clientApi
      .service('/recruitment')
      .delete(recruitmentId);
  } catch (error) {
    console.error('Error deleting recruitment:', error);
    throw error;
  }
}

//api for Application
export const getApplicationApi = async (params = {}) => {
  try {
    return await clientApi
      .service('/application')
      .find({
        page: params.page || 1,
        limit: params.pageSize || 10,
        search: params.search || '',
        recruitmentId: params.recruitmentId
      });
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}
export const createApplicationApi = async (data) => {
  try {
    return await clientApi
      .service('/application')
      .create(data);
  } catch (error) {
    console.error('Lỗi tạo ứng viên:', error);
    throw error;
  }
}

export const updateApplicationApi = async (id, data) => {
  try {
    return await clientApi
      .service('/application')
      .put(id, data);
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}
export const getApplicationById = async (id) => {
  try {
    return await clientApi
      .service('/application')
      .get(id);
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}
export const deleteApplicationApi = async (recruitmentId) => {
  try {
    return await clientApi
      .service('/application')
      .delete(recruitmentId);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

///  API for order book
export const getOrderBookApi = async (params = {}) => {
  try {
    return await clientApi
      .service('/booking')
      .find({
        page: params.page || 1,
        limit: params.pageSize || 10,
        search: params.search || '',
        statusPayment: params.statusPayment || '',
        statusOrder: params.statusOrder || ''
      });
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
export const getBookingById = async (id) => {
  try {
    return await clientApi
      .service('/booking')
      .get(id);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
export const updateBookingApi = async (id, data) => {
  try {
    return await clientApi
      .service('/booking')
      .put(id, data);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}


// API for promotion
export const createPromotion = async (data) => {
  try {
    return await clientApi
      .service('/promotion')
      .create(data);
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
}
export const updatePromotion = async (id, data) => {
  try {
    return await clientApi
      .service('/promotion')
      .put(id, data);
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
}
export const getPromotionById = async (id) => {
  try {
    return await clientApi
      .service('/promotion')
      .get(id);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
}
const getListOrder = async (id) => {
  try {
    return clientApi.service("order").get(id);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}
const payment = async (data) => {
  try {
    return axios.post("http://localhost:3000/api/payment", data)
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}
const leaveApplication = async (data) => {
  try {
    return clientApi.service("leave-applications").create(data);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}
const getPromotion = async (params) => {
  try {
    return await clientApi
      .service('/promotion')
      .find(params);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
}
export {
  createUser,
  getAllStaffApi,
  updateStaff,
  addStaff,
  deleteStaff,
  getAllIngredientApi,
  searchBooking,
  serveBooking,
  addOrderDetail,
  getListOrder,
  payment,
  leaveApplication,
  getPromotion
};