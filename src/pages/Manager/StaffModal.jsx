import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const StaffModal = ({ visible, staff, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes or staff changes
  useEffect(() => {
    if (visible) {
      if (staff) {
        form.setFieldsValue({
          ...staff,
          hireDate: staff.hireDate ? moment(staff.hireDate) : null
        });
      } else {
        // Clear form for new entry
        form.resetFields();
      }
    }
  }, [visible, staff, form]);

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        // Convert moment date to ISO string if needed
        if (values.hireDate) {
          values.hireDate = values.hireDate.toISOString();
        }
        
        // Call parent component's submit handler
        onSubmit(values);
      })
      .catch(errorInfo => {
        message.error('Validation Failed');
      });
  };

  return (
    <Modal
      title={staff ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="staff_form"
      >
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="position"
          label="Vị trí"
          rules={[{ required: true, message: 'Vui lòng chọn vị trí phù hợp' }]}
        >
          <Select placeholder="Chọn vị trí công việc">
            <Option value="waiter">Waiter</Option>
            <Option value="chef">Chef</Option>
            <Option value="manager">Manager</Option>
            <Option value="cashier">Cashier</Option>
          </Select>
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
          rules={[
            { required: true, message: 'Vui lòng nhập lương' }          ]}
        >
          <Input placeholder="Nhập vào mức lương cụ thể" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại hình nhân viên"
          rules={[{ required: true, message: 'Chọn loại hình nhân viên phù hợp' }]}
        >
          <Select placeholder="Chọn vị trí công việc">
            <Option value="full-time">Full time</Option>
            <Option value="part-time">Part time</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffModal;