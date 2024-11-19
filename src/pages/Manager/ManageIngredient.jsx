import React, { useState, useEffect } from 'react';
import { CiImport, CiExport } from "react-icons/ci";
import { getAllIngredientApi } from '../../services/apiService';
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
  message,
  Upload
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
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;

const ManageIngredient = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalIngredients, setTotalIngredients] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số lượng bản ghi trên mỗi trang
    total: 0,    // Tổng số bản ghi (lấy từ API)
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [form] = Form.useForm();

  const totalMaterials = materials.length;
  const lowStockMaterials = materials.filter(m => m.status === 'Thấp').length;
  const getAllIngredient= async () => {
    try {
      setLoading(true);
      const params={
        page: pagination.current,
        pageSize: pagination.pageSize
      }
      const response = await getAllIngredientApi(params);
       const ingredientList = response?.DT?.docs || [];
      setTotalIngredients(response.DT.totalDocs);
      const formattedData = ingredientList.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        inventory: ingredient.inventory,
        unit: ingredient.unit,
        category: ingredient.type,
        status: ingredient.status === 'active' ? 'Đủ' : 'Thấp',
      }));
      setPagination({
        ...pagination,
        current: response?.DT?.page,
        total: response?.DT?.totalPages || 0,
        pageSize: response?.DT?.limit || 10,
      });
      setMaterials(formattedData);
    } catch (error) {
      message.error('Failed to load ingredient data');
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllIngredient(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination) => {
    getAllIngredient(pagination.current, pagination.pageSize);
  };
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
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => <Tag color="processing">{category}</Tag>
    },
    {
      title: 'Số Lượng',
      key: 'inventory',
      render: (record) => (
        <div>
         <div>
        <span style={{ color: record.inventory < 10 ? 'red' : 'green' }}>
            {record.inventory}
        </span>
    </div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => {
        // Xác định trạng thái dựa trên số lượng
        const status = record.inventory < 10 ? 'Thấp' : 'Đủ';
        return (
          <Tag color={status === 'Thấp' ? 'error' : 'success'}>
            {status}
          </Tag>
        );
      },
    },
    {
      key: 'actions',
      width: 150,
      render: (record) => (
        <div>
          <Button 
            type="primary" 
            ghost 
            size="small"
            icon={<EditOutlined />} 
            style={{ marginRight: 8 }}
            onClick={() => {
              setCurrentMaterial(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
          </Button>
          <Button 
            size="small"
            icon={<CiImport />}
            style={{ marginRight: 8 }} 
            onClick={() => {
              // Implement import logic
            }}
          />
          <Button 
          type='default'
            size="small"
            icon={<CiExport />}
            style={{ marginRight: 8 }} 
            onClick={() => {
              // Implement export logic
            }}
          />
          <Button 
            type="default" 
            size="small"
            style={{ marginRight: 8 }} 
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setMaterials(materials.filter(m => m.id !== record.id));
              message.success(`Xóa ${record.name} thành công`);
            }}
          >
          </Button>
        </div>
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
            <Card 
              hoverable 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white' 
              }}
            >
              <Statistic
                title={<span style={{color: 'white'}}>Tổng Số Nguyên Liệu</span>}
                value={totalIngredients}
                prefix={<DatabaseOutlined style={{color: 'white'}} />}
                valueStyle={{color: 'white'}}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card 
              hoverable 
              style={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff9a9a 100%)', 
                color: 'white' 
              }}
            >
              <Statistic
                title={<span style={{color: 'white'}}>Nguyên Liệu Cạn Kho</span>}
                value={lowStockMaterials}
                prefix={<AlertOutlined style={{color: 'white'}} />}
                valueStyle={{ color: lowStockMaterials > 0 ? 'yellow' : 'white' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Card 
              hoverable 
              style={{ 
                background: 'linear-gradient(135deg, #4fcf70 0%, #4fcf70 100%)', 
                color: 'white' 
              }}
            >
              <Statistic
                title={<span style={{color: 'white'}}>Tỷ Lệ Tồn Kho</span>}
                value={Math.round((1 - lowStockMaterials / totalMaterials) * 100)}
                suffix="%"
                prefix={<StockOutlined style={{color: 'white'}} />}
                valueStyle={{color: 'white'}}
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
                scroll={{ x: 600, y: 300 }}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'],
                }}
                loading={loading}
                onChange={handleTableChange}
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
              rules={[
                { required: true, message: 'Nhập tổng số lượng' },
                { type: 'number', min: 1, message: 'Nhập số lượng hợp lệ' }
              ]}
            >
              <Input type="number" placeholder="Nhập tổng số lượng" />
            </Form.Item>
            <Form.Item 
              name="quantity" 
              label="Số Lượng Hiện Tại" 
              rules={[
                { required: true, message: 'Nhập số lượng hiện tại' },
                { type: 'number', min: 0, message: 'Nhập số lượng hợp lệ' }
              ]}
            >
              <Input type="number" placeholder="Nhập số lượng hiện tại" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}
export default ManageIngredient;