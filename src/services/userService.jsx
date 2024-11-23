import clientApi from "../client-api/rest-client-api.js";

export const getRecruitments = async (page, limit, search) => {
    try {
        const response = await clientApi.service('recruitment').find({
            page,
            limit,
            search
        });

        if (response?.EC === 0) {
            const { recruiments, total } = response.DT;
            return {
                data: recruiments,
                total: total
            };
        } else {
            throw new Error(response?.EM || "Không lấy được danh sách tuyển dụng");
        }
    } catch (error) {
        console.error('Error in getRecruitments:', error);
        throw error;
    }
}

export const applyRecruitment = async (data) => {
    try {
        const response = await clientApi.service('application').create(data);

        if (response?.EC === 0) {
            return response;
        } else {
            throw new Error(response?.EM || "Không thể ứng tuyển");
        }
    } catch (error) {
        console.error('Error in applyRecruitment:', error);
        throw error;
    }
}

export const getAllFood = async (page, limit, search, type, status) => {
    try {
        const response = await clientApi.service('foods').find({ page, limit, search, type, status });
        if (response?.EC === 0) {
            const { foods, total } = response.DT;
            return {
                data: foods,
                totalItem: total
            };
        } else {
            throw new Error(response?.EM || "Không lấy được danh sách món ăn");
        }
    } catch (error) {
        console.error('Error in getAllFood:', error);
        throw error;
    }
}

export const bookingTable = async (data) => {
    try {
        const response = await clientApi.service('booking').create(data);
        if (response?.EC === 0) {
            return response;
        } else {
            throw new Error(response?.EM || "Không thể đặt bàn");
        }
    } catch (error) {
        console.error('Error in bookingTable:', error);
        throw error;
    }
}

export const updateUser = async (id, data) => {
    try {
        const response = await clientApi.client.put(`users/profile`, { id, ...data }); // URL chính xác
        return response;
    } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
    }
};

export const getBookings = async (page, limit, date) => {
    try {
        const response = await clientApi.service('booking').find({ page, limit, date });
        if (response?.EC === 0) {
            const { bookings, metadata } = response.DT;
            return {
                data: bookings,
                total: metadata.total
            };
        } else {
            throw new Error(response?.EM || "Không lấy được danh sách đặt bàn");
        }
    } catch (error) {
        console.error('Error in getBookings:', error);
        throw error;
    }
}

export const updateBooking = async (id) => {
    try {
        const response = await clientApi.service('booking').put(id, { status: 'canceled' });
        if (response?.EC === 0) {
            return response;
        } else {
            throw new Error(response?.EM || "Không thể cập nhật trạng thái đặt bàn");
        }
    } catch (error) {
        console.error('Error in updateBooking:', error);
        throw error;
    }
}

export const getValidPromotion = async (page, limit, search) => {
    try {
        const response = await clientApi.service('promotion').find({ page, limit, search });
        if (response?.EC === 0) {
            const promotions = response.DT;
            return {
                data: promotions.promotions,
                total: promotions.total
            };
        } else {
            throw new Error(response?.EM || "Không lấy được danh sách khuyến mãi");
        }
    } catch (error) {
        console.error('Error in getValidPromotion:', error);
        throw error;
    }
}
export const register = async (data) => {

    try {
        const response = await clientApi.service('register').create(data);
        if (response?.EC === 0) {
            return response;
        } else {
            throw new Error(response?.EM || "Không thể đăng ký");
        }
    } catch (error) {
        console.error('Error in register:', error);
        throw error;
    }
}
