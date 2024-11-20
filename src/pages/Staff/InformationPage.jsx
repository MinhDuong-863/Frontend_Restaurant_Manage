import { Button, Card, Col, Flex, Form, Input, message, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import clientApi from "../../client-api/rest-client-api.js";
import { useDispatch, useSelector } from "react-redux";
import { setInformation } from "../../redux/action/authenSlice.jsx";
import UploadImage from "../../components/UploadImage.jsx";
import { deleteImageFromCloudinaryByLink } from "../../utils/cloudinary.jsx";
import { position } from "../../constant/constant.js";
import { info } from "sass";
const { Title, Text } = Typography;
const InformationPage = () => {
    const inforUser = useSelector(state => state.authen.user);
    const inforStaff = useSelector(state => state.staff);
    const dispatch = useDispatch();
    const [imageUploaded, setImageUploaded] = useState(null);
    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(true);
    const onFinish = (values) => {
        clientApi.service('users/profile').put('', values).then(res => {
            if (res.EC === 0) {
                message.success(res.EM);
                deleteImageFromCloudinaryByLink(inforUser.avatar);
                dispatch(setInformation(res.DT));
                setDisabled(true);
            }
        }).catch(err => {
            console.log(err);
        });
    }
    const handleReset = () => {
        form.resetFields();
        setDisabled(true);
        // Xoá ảnh đã upload lên Cloudinary nhưng không thực hiện cập nhật vào DB
        deleteImageFromCloudinaryByLink(imageUploaded);
        setImageUploaded(null)
    };
    useEffect(() => {
        console.log(inforStaff);
    }, []);
    return (
        <Card
            title={<Flex align="center" justify="center"><Title level={3}>Thông tin cá nhân</Title></Flex>}
            style={{ width: "100%" }}
        >
            <Form
                style={{ fontWeight: 600 }}
                onChange={() => form.isFieldsTouched(true) ? setDisabled(true) : setDisabled(false)}
                onReset={handleReset}
                form={form}
                layout="vertical"
                initialValues={inforUser}
                size="large"
                onFinish={onFinish}>


                <Flex justify="center">
                    <Form.Item name="avatar">
                        <UploadImage src={inforUser?.avatar} setSrc={(url) => { form.setFieldsValue({ avatar: url }); setImageUploaded(url) }} />
                    </Form.Item>
                </Flex>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            layout="horizontal"
                            label="Vai trò"
                        >
                            <Text style={{ fontWeight: 800 }}>
                                {position[inforUser.role]}
                            </Text>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            layout="horizontal"
                            label="Chức vụ"
                        >
                            <Text style={{ fontWeight: 800 }}>
                                {position[inforStaff.position]}
                            </Text>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            layout="horizontal"
                            label="Mức lương"
                        >
                            <Text style={{ fontWeight: 800 }}>
                                {inforStaff.salary.toLocaleString() + " VND"}
                            </Text>
                        </Form.Item>
                    </Col>
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

                </Row>
                <Flex justify="end" gap={8}>
                    <Form.Item>
                        <Button type="default" htmlType="reset">Hủy</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button disabled={disabled} type="primary" htmlType="submit">Cập nhật</Button>
                    </Form.Item>
                </Flex>
            </Form>
        </Card >

    );
}
export default InformationPage;