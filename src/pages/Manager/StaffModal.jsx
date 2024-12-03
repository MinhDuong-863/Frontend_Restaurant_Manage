import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { createUser, addStaff } from '../../services/apiService';
import './staff.scss';
const { Option } = Select;

const StaffModal = ({ visible, staff, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!staff) {
        // Create new user first
        const userData = {
          username: values.username,
          password: values.password,
          last_name: values.last_name,
          first_name: values.first_name,
          email: values.email,
          cid: values.cid,
          address: values.address,
          phone_number: values.contact
        };

        const userResponse = await createUser(userData);
        console.log(userResponse);
        if (userResponse?.DT?._id) {
          // Then create staff with user_id
          console.log(userResponse.DT._id);
          const staffData = {
            user_id: userResponse.DT._id,
            position: values.position,
            salary: Number(values.salary),
            type: values.type
          };

          await addStaff(staffData);
          message.success('Thêm nhân viên mới thành công');
          onSubmit();
        }
      } else {
        // Handle update case
        onSubmit(values);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  React.useEffect(() => {
    if (visible && staff) {
      form.setFieldsValue({
        name: staff.name,
        position: staff.position.toLowerCase(),
        contact: staff.contact,
        email: staff.email,
        salary: staff.salary,
        type: staff.type
      });
    } else if (visible && !staff) {
      form.resetFields();
    }
  }, [visible, staff, form]);

  return (
    <Modal
      title={staff ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Lưu"
      width={800}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ position: 'staff' }}
        name="staff_form"
      >
        {!staff && (
          <>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              name="first_name"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Họ"
              rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
            >
              <Input placeholder="Nhập họ" />
            </Form.Item>

            <Form.Item
              name="cid"
              label="CMND/CCCD"
              rules={[{ required: true, message: 'Vui lòng nhập CMND/CCCD' }]}
            >
              <Input placeholder="Nhập CMND/CCCD" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="position"
          label="Vị trí"
          rules={[{ required: true, message: 'Vui lòng chọn vị trí phù hợp' }]}
        >
          <Input readOnly placeholder="Nhập vị trí công việc" />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { 
              pattern: /^[0-9]{10}$/, 
              message: 'Số điện thoại hợp lệ phải có 10 chữ số' 
            }
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Nhập đúng định dạng email' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="salary"
          label="Lương"
          rules={[{ required: true, message: 'Vui lòng nhập lương' }]}
        >
          <Input placeholder="Nhập vào mức lương cụ thể" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại hình nhân viên"
          rules={[{ required: true, message: 'Chọn loại hình nhân viên phù hợp' }]}
        >
          <Select placeholder="Chọn loại hình nhân viên">
            <Option value="full-time">Full time</Option>
            <Option value="part-time">Part time</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffModal;