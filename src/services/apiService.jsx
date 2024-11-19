import clientApi from "../client-api/rest-client-api";
//handle api for staff
const token=localStorage.getItem('token')
const getAllStaffApi= async(params = {})=>{
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
const updateStaff=async(staffId,staffInfo)=>{
    try {
        return await clientApi
          .service('/staff')
          .put(staffId, staffInfo);
      } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
      }
}
const addStaff=async(staffInfo)=>{
    try {
        return await clientApi
          .service('/staff')
          .create(staffInfo);
      } catch (error) {
        console.error('Error adding staff:', error);
        throw error;
      }
}
const deleteStaff=async(staffId)=>{
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
export {getAllStaffApi, updateStaff, addStaff, deleteStaff, getAllIngredientApi};