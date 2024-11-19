import { Avatar, Button, Card, Col, Flex, Form, Input, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;
const InformationPage = () => {
    const inforUser = useSelector(state => state.authen.user);
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(true);
    const onFinish = (values) => {
        console.log('Success:', values);
    }
    return (
        <Card
            title={<Flex align="center" justify="center"><Title level={3}>Thông tin cá nhân</Title></Flex>}
            style={{ width: "100%" }}
        >
            <Form
                style={{ fontWeight: 600 }}
                onChange={() => form.isFieldsTouched(true) ? setDisabled(true) : setDisabled(false)}
                onReset={() => { form.resetFields(); setDisabled(true) }}
                form={form}
                layout="vertical"
                initialValues={inforUser}
                size="large"
                onFinish={onFinish}>


                <Flex justify="center">
                    <Form.Item name="avatar">
                        <Avatar size={200} src={inforUser?.avatar} />
                    </Form.Item>
                </Flex>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ"
                            name="last_name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tên"
                            name="first_name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone_number"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="CID"
                            name="cid"
                            rules={[{ required: true, message: 'Vui lòng nhập CID!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            layout="horizontal"
                            label="Vai trò"
                        >
                            <Text style={{ fontWeight: 800 }}>
                                {"Nhân viên"}
                            </Text>
                        </Form.Item>
                    </Col>
                </Row>
                <Flex justify="end" gap={8}>
                    <Form.Item>
                        <Button type="default" htmlType="reset">Hủy</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button disabled={disabled} type="primary" htmlType="submit">Cập nhật thông tin</Button>
                    </Form.Item>
                </Flex>

            </Form>
        </Card >

    );
}
export default InformationPage;