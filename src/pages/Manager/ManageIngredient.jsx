import React, { useState } from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Modal, 
  Form, 
  Input, 
  Button, 
  Select,
  Table,
  Tag,
  message
} from 'antd';
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  DatabaseOutlined, 
  StockOutlined, 
  AlertOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ManageIngredient = () => {
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Gạo', quantity: 500, total: 1000, status: 'Đủ', category: 'Nguyên Liệu Chính' },
    { id: 2, name: 'Thịt heo', quantity: 150, total: 500, status: 'Thấp', category: 'Protein' },
    { id: 3, name: 'Rau', quantity: 80, total: 200, status: 'Thấp', category: 'Rau Và Củ' },
    { id: 4, name: 'Nước Mắm', quantity: 30, total: 50, status: 'Thấp', category: 'Gia Vị' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [form] = Form.useForm();

  const totalMaterials = materials.length;
  const lowStockMaterials = materials.filter(m => m.status === 'Thấp').length;

  const pieData = materials.map(m => ({
    name: m.name,
    value: (m.quantity / m.total) * 100
  }));

  const categoryData = materials.reduce((acc, m) => {
    const existing = acc.find(item => item.category === m.category);
    if (existing) {
      existing.quantity += m.quantity;
      existing.total += m.total;
    } else {
      acc.push({ 
        category: m.category, 
        quantity: m.quantity, 
        total: m.total 
      });
    }
    return acc;
  }, []);

  const barData = categoryData.map(item => ({
    category: item.category,
    'Tỷ Lệ Tồn Kho (%)': Math.round((item.quantity / item.total) * 100)
  }));

  const tableColumns = [
    {
      title: 'Tên Nguyên Liệu',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Số Lượng',
      key: 'quantity',
      render: (record) => `${record.quantity}/${record.total}`,
      width: 120,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'Thấp' ? 'red' : 'green'}>{status}</Tag>
      )
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: 120,
      render: (record) => (
        <Button 
          type="primary" 
          ghost 
          size="small"
          onClick={() => {
            setCurrentMaterial(record);
            form.setFieldsValue(record);
            setIsModalVisible(true);
          }}
        >
          Cập Nhật
        </Button>
      )
    }
  ];

  const handleUpdateMaterial = () => {
    form.validateFields().then(values => {
      const updatedMaterials = materials.map(material => 
        material.id === currentMaterial?.id 
          ? {
              ...material, 
              ...values,
              status: (values.quantity / values.total) * 100 < 20 ? 'Thấp' : 'Đủ'
            } 
          : material
      );

      setMaterials(updatedMaterials);
      setIsModalVisible(false);
      message.success(`Cập nhật ${values.name} thành công`);
    }).catch(errorInfo => {
      message.error('Vui lòng kiểm tra lại thông tin');
    });
  };

  const handleAddMaterial = () => {
    form.validateFields().then(values => {
      const newMaterial = {
        ...values,
        id: materials.length + 1,
        status: (values.quantity / values.total) * 100 < 20 ? 'Thấp' : 'Đủ'
      };

      setMaterials([...materials, newMaterial]);
      setIsModalVisible(false);
      message.success(`Thêm ${values.name} thành công`);
    }).catch(errorInfo => {
      message.error('Vui lòng kiểm tra lại thông tin');
    });
  };

  return (
    <Layout style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        width: '100%' 
      }}>
        <Row gutter={[16, 16]}>
          {/* Thống kê */}
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable>
              <Statistic
                title="Tổng Số Nguyên Liệu"
                value={totalMaterials}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable>
              <Statistic
                title="Nguyên Liệu Cạn Kho"
                value={lowStockMaterials}
                prefix={<AlertOutlined />}
                valueStyle={{ color: lowStockMaterials > 0 ? 'red' : 'green' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Card hoverable>
              <Statistic
                title="Tỷ Lệ Tồn Kho"
                value={Math.round((1 - lowStockMaterials / totalMaterials) * 100)}
                suffix="%"
                prefix={<StockOutlined />}
              />
            </Card>
          </Col>

          {/* Biểu đồ */}
          <Col xs={24} lg={12}>
            <Card 
              title="Trạng Thái Từng Nguyên Liệu"
              style={{ height: '450px', overflow: 'auto' }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title="Tỷ Lệ Tồn Kho Theo Nhóm"
              style={{ height: '450px', overflow: 'auto' }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Tỷ Lệ Tồn Kho (%)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Bảng chi tiết */}
          <Col span={24}>
            <Card 
              title="Chi Tiết Nguyên Liệu" 
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCurrentMaterial(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                >
                  Thêm Nguyên Liệu
                </Button>
              }
            >
              <Table 
                columns={tableColumns} 
                dataSource={materials} 
                rowKey="id"
                scroll={{ x: 600, y: 300 }}  // Thêm khả năng cuộn ngang và dọc
                pagination={{ 
                  pageSize: 5,  // Giới hạn số dòng trên mỗi trang
                  showSizeChanger: false 
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal cập nhật/thêm nguyên liệu */}
        <Modal
          title={currentMaterial ? 'Cập Nhật Nguyên Liệu' : 'Thêm Nguyên Liệu'}
          visible={isModalVisible}
          onOk={currentMaterial ? handleUpdateMaterial : handleAddMaterial}
          onCancel={() => setIsModalVisible(false)}
          destroyOnClose
        >
          <Form form={form} layout="vertical" preserve={false}>
            {!currentMaterial && (
              <Form.Item 
                name="name" 
                label="Tên Nguyên Liệu"
                rules={[{ required: true, message: 'Nhập tên nguyên liệu' }]}
              >
                <Input placeholder="Nhập tên nguyên liệu" />
              </Form.Item>
            )}
            <Form.Item 
              name="category" 
              label="Nhóm Nguyên Liệu"
              rules={[{ required: true, message: 'Chọn nhóm nguyên liệu' }]}
            >
              <Select placeholder="Chọn nhóm">
                <Option value="Nguyên Liệu Chính">Nguyên Liệu Chính</Option>
                <Option value="Protein">Protein</Option>
                <Option value="Rau Và Củ">Rau Và Củ</Option>
                <Option value="Gia Vị">Gia Vị</Option>
              </Select>
            </Form.Item>
            <Form.Item 
              name="total" 
              label="Tổng Số Lượng"
              rules={[{ required: true, message: 'Nhập tổng số lượng' }]}
            >
              <Input type="number" placeholder="Nhập tổng số lượng" />
            </Form.Item>
            <Form.Item 
              name="quantity" 
              label="Số Lượng Hiện Tại"
              rules={[{ required: true, message: 'Nhập số lượng' }]}
            >
              <Input type="number" placeholder="Nhập số lượng" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default ManageIngredient;