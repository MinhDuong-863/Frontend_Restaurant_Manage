import React, { useState } from 'react';
import { Form, Input, Button, notification, Typography, DatePicker, Row, Col, Flex, message } from 'antd';
import styles from './LeaveApplication.module.scss'
import { leaveApplication } from '../../services/apiService';
import { useSelector } from 'react-redux';
const { Title, Text } = Typography;
const LeaveApplication = () => {
    const [loading, setLoading] = useState(false);
    const staff_id = useSelector(state => state.staff._id);
    const onFinish = (values) => {
        setLoading(true);
        console.log('Success:', values);
        // Giả lập gửi email
        leaveApplication({ ...values, staff_id }).then((res) => {
            if (res.EC === 0) {
                message.success(res.EM);
            } else {
                message.error(res.EM);
            }
        })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            })
    };
    return (
        <div className={styles["constainer"]}>
            <Text className={styles["title"]}>Xin nghỉ phép</Text>
            <Flex className='w-100' align='center' vertical>
                <Form
                    size='large'
                    className={styles["form"]}
                    name="mailForm"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item

                                wrapperCol={{ span: 24 }}
                                labelCol={{ span: 24 }}
                                label="Ngày bắt đầu"
                                name="start_date"
                                rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* Ngày kết thúc */}
                            <Form.Item
                                wrapperCol={{ span: 24 }}
                                labelCol={{ span: 24 }}
                                label="Ngày kết thúc"
                                name="end_date"
                                rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc!" }]}>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Lý do */}
                    <Form.Item
                        label="Lý do"
                        name="reason"
                        rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
                    >
                        <Input.TextArea rows={5} placeholder='Nhập lý do xin nghỉ' />
                    </Form.Item>
                    <Flex justify='end'>
                        {/* Nút gửi */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Gửi
                            </Button>
                        </Form.Item>
                    </Flex>
                </Form>
            </Flex>
        </div>
    );
};

export default LeaveApplication;
