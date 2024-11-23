import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { register } from "../../services/userService";
import styles from "./Register.module.scss";

const { Option } = Select;

const Register = () => {
    const onFinish = (values) => {
        register({ ...values, role: "customer" })
        console.log("Submitted values: ", values);
    };

    const onFinishFailed = (errorInfo) => {
        message.error("Vui lòng kiểm tra lại các trường thông tin!");
        console.log("Failed: ", errorInfo);
    };

    return (
        <Form
            name="registrationForm"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
                username: "admin12",
                role: "admin",
                last_name: "Nguyễn Huỳnh",
                first_name: "Nguyên",
                email: "billbatri0888@gmail.com",
                cid: "098765433112",
                address: "Thủ Đức",
                phone_number: "0987654322",
            }}
        >
            <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                    { min: 5, message: "Tên đăng nhập phải có ít nhất 5 ký tự!" },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Họ"
                name="last_name"
                rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Tên"
                name="first_name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Số CMND/CCCD"
                name="cid"
                rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Số điện thoại"
                name="phone_number"
                rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                        pattern: /^[0-9]{10,11}$/,
                        message: "Số điện thoại phải có 10-11 chữ số hợp lệ!",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button className={styles["btn"]} type="primary" htmlType="submit">
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;
