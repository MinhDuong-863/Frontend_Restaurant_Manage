import React, { useState, useEffect } from 'react';
import { 
  Card,
  Select, 
  Button, 
  Table, 
  message, 
  Form,
  Typography,
  Space,
  Row,
  Col,
  DatePicker
} from 'antd';
import moment from 'moment';
import clientApi from '../../../client-api/rest-client-api';

const { Title } = Typography;
const { Option } = Select;

const ShiftManagement = () => {
  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaffList();
    fetchShifts();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await clientApi.service('staff').find();
      setStaffList(response.data);
    } catch (error) {
      message.error('Failed to fetch staff list');
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await clientApi.service('shift').find();
      setShifts(response.data);
    } catch (error) {
      message.error('Failed to fetch shifts');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const shiftData = {
        date: values.date.format('YYYY-MM-DD[T]00:00:00.000+07:00'),
        shift_number: values.shift_number,
        list_staff: values.list_staff
      };

      await clientApi.service('shift').create(shiftData);
      message.success('Tạo ca làm việc thành công');
      form.resetFields();
      fetchShifts();
    } catch (error) {
      message.error('Không thể tạo ca làm việc');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Ca làm việc',
      dataIndex: 'shift_number',
      key: 'shift_number',
      render: (shift) => `Ca ${shift}`
    },
    {
      title: 'Nhân viên',
      dataIndex: 'list_staff',
      key: 'list_staff',
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>Phân ca làm việc</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            {/* <Col xs={24} sm={8}>
              <Form.Item
               name="dateShift"
                label="Ngày làm việc"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  //format={"DD/MM/YYYY"}
                />
              </Form.Item>
            </Col> */}

            <Col xs={24} sm={8}>
              <Form.Item
                name="shift_number"
                label="Ca làm việc"
                rules={[{ required: true, message: 'Vui lòng chọn ca!' }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value={1}>Ca 1</Option>
                  <Option value={2}>Ca 2</Option>
                  <Option value={3}>Ca 3</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="list_staff"
                label="Nhân viên"
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
              >
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Chọn nhân viên"
                >
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Tạo ca làm việc
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={shifts}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ShiftManagement;