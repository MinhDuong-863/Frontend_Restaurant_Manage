import { Modal, Form, Input, DatePicker } from "antd";
import PropTypes from 'prop-types';

const ApplyModal = ({ isVisible, onClose, onSubmit, recruitmentId }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const formData = {
                    ...values,
                    recruitment_id: recruitmentId,
                    dob: values.dob.format("YYYY-MM-DD"), // Định dạng ngày sinh
                };
                onSubmit(formData); // Gửi dữ liệu ứng tuyển
                form.resetFields(); // Reset form sau khi gửi
                onClose(); // Đóng modal
            })
            .catch((info) => {
                console.error("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Thông tin ứng tuyển:"
            open={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Gửi ứng tuyển"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Họ và tên"
                    name="full_name"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phone_number"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                    label="CMND/CCCD"
                    name="cid"
                    rules={[{ required: true, message: "Vui lòng nhập CMND/CCCD!" }]}
                >
                    <Input placeholder="Nhập CMND/CCCD" />
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                    <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Form.Item
                    label="Ngày sinh"
                    name="dob"
                    rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Giới thiệu bản thân" name="about">
                    <Input.TextArea placeholder="Viết vài dòng về bản thân bạn" />
                </Form.Item>
                <Form.Item label="Yêu cầu đặc biệt" name="require">
                    <Input.TextArea placeholder="Yêu cầu đặc biệt (nếu có)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
ApplyModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    recruitmentId: PropTypes.string.isRequired,
};

export default ApplyModal;