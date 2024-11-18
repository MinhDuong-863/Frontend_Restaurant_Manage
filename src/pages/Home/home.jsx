import { Button, Form, Input, message } from "antd";
import React from "react";
import clientApi from "../../client-api/rest-client-api";
import { useDispatch } from "react-redux";
import { login } from "../../redux/action/authenSlice";
const Home = () => {
    const dispatch = useDispatch();
    const onFinish = (values) => {
        let authen = clientApi.service('');
        authen.authenticate(values)
            .then(response => {
                console.log(response);
                if (response.EC === 0) {
                    // set token vào redux, refresh token vào cookies
                    dispatch(login({ token: response.DT.accessToken, user: response.DT.user }));
                    // document.cookie = `refreshToken=${response.data.DT.refreshToken}`;
                    message.success('Login success');
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            {/* <img src="https://res.cloudinary.com/degcwwwii/image/upload/v1731919844/Avatar/qwh9wgvqapga6rmcl5so.jpg" alt="Ironhack logo"
                style={{ height: '100vh' }}
            /> */}
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>



                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Home;