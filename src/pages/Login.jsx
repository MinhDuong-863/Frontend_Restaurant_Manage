import { Button, Input, Form, Typography, Col, Row, Flex, message } from 'antd';
import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
import clientApi from "../client-api/rest-client-api";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/authenSlice";
import { PATHS } from '../constant/path';
const Login = () => {
    const dispatch = useDispatch();
    const naviagte = useNavigate();

    const handleLogin = (values) => {
        let authen = clientApi.service('');
        authen.authenticate(values)
            .then(response => {
                console.log(response);
                if (response.EC === 0) {
                    // set token vào redux, refresh token vào cookies
                    console.log(response.DT.accessToken, response.DT.user);
                    localStorage.setItem('token', response.DT.accessToken);
                    dispatch(login({ token: response.DT.accessToken, user: response.DT.user }));
                    document.cookie = `refreshToken=${response.DT.refreshToken}`;
                    message.success('Đăng nhập thành công');
                    //check role chuyển trang  
                    if (response.DT.user.role === 'admin') {
                        naviagte(PATHS.ADMIN.DASHBOARD);
                    }
                    else if (response.DT.user.role === 'staff') {

                        naviagte(PATHS.STAFF.INFORMATION);
                    }
                    else if (response.DT.user.role === 'manager') {
                        naviagte(PATHS.MANAGER.DASHBOARD);
                    }
                    else {
                        naviagte(PATHS.HOME.HOMEPAGE);
                    }
                }
                else {
                    message.error(response.EM);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <Row className="login-container">

            <Col span={15} className="login-right">
                <Title className='welcome' level={2}>Chào mừng đến với nhà hàng của chúng tôi!</Title>
                <Flex vertical className='form-container mt-4' align='center'>
                    <Text className='fs-3 title'>Đăng nhập</Text>
                    <Form
                        onFinish={handleLogin}
                        size='large'
                        requiredMark={false}
                        className='w-100 mt-3'
                        name="login-form"
                        layout="vertical"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            label="Tên đăng nhập"
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button">
                            Đăng nhập
                        </Button>
                    </Form>
                    <Link className="forgot-password text-decoration-none" href="#">Quên mật khẩu?</Link>
                    <div className="register">
                        Bạn chưa có tài khoản? <Link className='text-decoration-none' href="#">Đăng ký ngay</Link>
                    </div>
                </Flex>
            </Col>
        </Row >
    );
};

export default Login;
