import React, { useState } from 'react';
import { Form, Input, Button, notification, Typography, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
const { Title } = Typography;
const SendMailPage = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        console.log('Form Data:', values);
        setLoading(true);

        // Giả lập gửi email
        setTimeout(() => {
            setLoading(false);
            notification.success({
                message: 'Gửi thành công!',
                description: `Email đã được gửi tới ${values.to}`,
            });
        }, 2000);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        notification.error({
            message: 'Gửi thất bại',
            description: 'Vui lòng kiểm tra lại thông tin email.',
        });
    };
    const emailOptions = [
        { value: 'user1@example.com', label: 'User 1 (user1@example.com)' },
        { value: 'user2@example.com', label: 'User 2 (user2@example.com)' },
        { value: 'user3@example.com', label: 'User 3 (user3@example.com)' },
    ];
    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
            <Title level={3}>Xin nghỉ phép</Title>
            <Form
                name="mailForm"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Đến"
                    name="to"
                    rules={[
                        { required: true, message: 'Vui lòng chọn ít nhất một email người nhận!' },
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn người nhận"
                        allowClear
                    >
                        {emailOptions.map((email) => (
                            <Option key={email.value} value={email.value}>
                                {email.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item
                    label="Nội dung"
                    name="message"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập nội dung thư" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Gửi Email
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SendMailPage;
