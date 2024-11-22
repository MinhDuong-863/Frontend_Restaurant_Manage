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
                totalItem: total
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
    try{
        const response = await clientApi.service('foods').find({page, limit, search, type, status});
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