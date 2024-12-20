import { message } from 'antd';
import axios from 'axios';
import { PATHS } from '../constant/path';

class RestClient {
    path = '';
    token = null;

    // Phương thức để thiết lập token mới
    setToken(newToken) {
        this.token = newToken; // Lưu token vào class nếu cần
        localStorage.setItem('token', newToken); // Cập nhật token vào localStorage
    }

    // Phương thức để xóa token (khi logout)
    clearToken() {
        this.token = null; // Xóa token trong class
        localStorage.removeItem('token'); // Xóa token khỏi localStorage
    }

    async config(url) {
        this.token = localStorage.getItem('token');
        // Cấu hình axios với URL cơ bản
        this.client = axios.create({
            baseURL: url,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Thiết lập interceptor để thêm token vào mỗi yêu cầu
        this.client.interceptors.request.use(
            config => {
                this.token = localStorage.getItem('token');
                if (this.token) {
                    config.headers['Authorization'] = `Bearer ${this.token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );
        this.client.interceptors.response.use(
            (response) => {
                return response.data;
            },
            async (error) => {
                const originalRequest = error.config;
                // Nếu mã lỗi 403 hoặc 401 và request không chứa key _retry
                if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        // Gọi API để cập nhật token mới
                        const res = await axiosInstance.get("/refreshToken");
                        if (res?.data?.EC === 0) {
                            let newToken = res.data.DT;
                            this.setToken(newToken);
                            // Thay đổi token trong header của yêu cầu ban đầu
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            // Gọi lại yêu cầu ban đầu với token mới
                            return axiosInstance(originalRequest);
                        }
                        else {
                            window.location.href = PATHS.HOME.LOGIN;
                            message.error(res?.data?.EM || "Có lỗi xảy ra");
                        }
                    } catch (error) {
                        window.location.href = PATHS.HOME.LOGIN;
                        message.error("Có lỗi xảy ra");
                    }
                } else if (error.response?.status === 400) {
                    message.error(error.response?.data?.EM || "Có lỗi xảy ra");
                } else {
                    console.log("error", error);
                    // Nếu lỗi không phải 403 hoặc 401, trả về lỗi ban đầu
                    return Promise.reject(error);
                }

            }
        );

    }

    // Phương thức đăng nhập để lấy token
    async authenticate(credentials) {
        try {
            const response = await this.client.post('/login', credentials);
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error in AUTHENTICATION:', error);
            throw error;
        }
    }
    async logout() {
        try {
            const response = await this.client.post('/users/logout');
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error in AUTHENTICATION:', error);
            throw error;
        }
    }


    // Phương thức để làm mới token khi hết hạn
    async reAuthenticate(refreshToken) {
        try {
            const response = await this.client.post('/refreshAuthentication', { refreshToken });
            this.token = response.data.token;
            this.dispatch(login({ token: response.data.DT.accessToken, user: response.data.DT.user }));
            return response.data;
        } catch (error) {
            console.error('Error in REAUTHENTICATION:', error);
            throw error;
        }
    }

    async get(objectId) {
        try {
            const response = await this.client.get(`${this.path}/${objectId}`);
            return response;
        } catch (error) {
            console.error('Error in GET:', error);
            throw error;
        }
    }

    async find(query) {
        try {
            const response = await this.client.get(this.path, { params: query });
            return response;
        } catch (error) {
            console.error('Error in FIND:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const response = await this.client.post(this.path, data);
            return response;
        } catch (error) {
            console.error('Error in CREATE:', error);
            throw error;
        }
    }

    async put(objectId, data) {
        try {
            const response = await this.client.put(`${this.path}/${objectId}`, data);
            return response;
        } catch (error) {
            console.error('Error in PATCH:', error);
            throw error;
        }
    }

    async delete(objectId) {
        try {
            const response = await this.client.delete(`${this.path}/${objectId}`);
            return response;
        } catch (error) {
            console.error('Error in DELETE:', error);
            throw error;
        }
    }

    service(path) {
        this.path = path;
        return this;
    }
}
let clientApi = new RestClient();
clientApi.config("http://localhost:3000/api/");
export default clientApi;