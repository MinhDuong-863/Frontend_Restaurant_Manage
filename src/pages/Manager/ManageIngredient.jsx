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
  DatabaseOutlined, 
  StockOutlined, 
  AlertOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ManageIngredient = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalIngredients, setTotalIngredients] = useState(0);
  const [operationType, setOperationType] = useState(null); 
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số lượng bản ghi trên mỗi trang
    total: 0,    // Tổng số bản ghi (lấy từ API)
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportExportModalVisible, setIsImportExportModalVisible] = useState(false);

  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [form] = Form.useForm();

  const totalMaterials = materials.length;
  const lowStockMaterials = materials.filter(m => m.status === 'Thấp').length;
  const getAllIngredient = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize
      };
      const response = await getAllIngredientApi(params);
      const ingredientList = response?.DT?.docs || [];
      
      setTotalIngredients(response.DT.totalDocs);
      const formattedData = ingredientList.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        inventory: ingredient.inventory,
        unit: ingredient.unit,
        category: ingredient.type,
        description: ingredient.description,
        status: ingredient.status === 'active' ? 'Đủ' : 'Thấp',
      }));
  
      setPagination(prevState => ({
        ...prevState,
        current: response?.DT?.page,
        total: response?.DT?.totalDocs || 0,
        pageSize: response?.DT?.limit || 10,
      }));
  
      setMaterials(formattedData);
    } catch (error) {
      message.error('Failed to load ingredient data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllIngredient(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    });
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
              setOperationType('import');
              setCurrentMaterial(record);
              form.resetFields();
              setIsImportExportModalVisible(true);
            }}
          />
          <Button 
            size="small"
            icon={<CiExport />}
            style={{ marginRight: 8 }} 
            onClick={() => {
              setOperationType('export');
              setCurrentMaterial(record);
              form.resetFields();
              setIsImportExportModalVisible(true);
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
  const handleImportMaterial = () => {
    form.validateFields().then(values => {
      const updatedMaterials = materials.map(material => 
        material.id === currentMaterial?.id 
          ? {
              ...material, 
              ...values,
              inventory: material.inventory + values.quantity,
              status: (material.inventory + values.quantity) < 20 ? 'Thấp' : 'Đủ'
            } 
          : material
      );

      setMaterials(updatedMaterials);
      setIsImportExportModalVisible(false);
      message.success(`Nhập nguyên liệu ${values.name} thành công`);
    }).catch(errorInfo => {
      message.error('Vui lòng kiểm tra lại thông tin');
    }
    );
  };
  const handleExportMaterial = () => {
    form.validateFields().then(values => {
      const updatedMaterials = materials.map(material => 
        material.id === currentMaterial?.id 
          ? {
              ...material, 
              ...values,
              inventory: material.inventory - values.quantity,
              status: (material.inventory - values.quantity) < 20 ? 'Thấp' : 'Đủ'
            } 
          : material
      );

      setMaterials(updatedMaterials);
      setIsImportExportModalVisible(false);
      message.success(`Xuất nguyên liệu ${values.name} thành công`);
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
                background: '#F39C12', 
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
                title={<span style={{color: 'white'}}>Nguyên Liệu Hết Hạn</span>}
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

          {/* Bảng chi tiết */}
          <Col span={24}>
            <Card 
              title="Chi Tiết Nguyên Liệu" 
              extra={
                <Button 
                  type="primary"
                  className='btn-custome'
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
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nguyên liệu`
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
          okText="Lưu"
          cancelText="Hủy"
          destroyOnClose
        >
          <Form form={form} layout="vertical" preserve={false}>
            {currentMaterial && (
              <Form.Item 
                name="name" 
                label="Tên Nguyên Liệu"
                rules={[{ required: true, message: 'Nhập tên nguyên liệu' }]}
              >
                <Input placeholder="Nhập tên nguyên liệu" />
              </Form.Item>
            )}
            <Form.Item 
              name="inventory" 
              label="Tồn kho"
              rules={[{ required: true, message: 'Nhập số lượng tồn kho' }]}
            >
              <Input readOnly placeholder="Nhập số lượng tồn kho" />
            </Form.Item>
            <Form.Item
              name="unit"
              label="Đơn Vị"
              rules={[{ required: true, message: 'Nhập đơn vị' }]}
            >
              <Input placeholder="Nhập đơn vị" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô Tả"
            >
              <Input.TextArea placeholder="Nhập mô tả" />
            </Form.Item>

            <Form.Item 
              name="type" 
              label="Nhóm Nguyên Liệu"
              rules={[{ required: true, message: 'Chọn nhóm nguyên liệu' }]}
            >
              <Select placeholder="Chọn nhóm">
                <Option value="Thịt">Thịt</Option>
                <Option value="Hải sản">Hải sản</Option>
                <Option value="Rau củ">Rau Và Củ</Option>
                <Option value="Gia vị">Gia Vị</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
          <Modal
            title={operationType === 'import' ? 'Nhập Nguyên Liệu' : 'Xuất Nguyên Liệu'}
            visible={isImportExportModalVisible}
            onOk={() => {
              operationType === 'import' ? handleImportMaterial() : handleExportMaterial();
            }}
            onCancel={() => setIsImportExportModalVisible(false)}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={currentMaterial || {}}
            >
              <Form.Item
                name="quantity"
                label="Số Lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item
                name="supplier"
                label="Nhà Cung Cấp"
                rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp!' }]}
              >
                <Input />
              </Form.Item>
              {operationType === 'import' && (
                <>
                  <Form.Item
                    name="price"
                    label="Giá Nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}
                  >
                    <Input type="number" min={0} />
                  </Form.Item>
                  <Form.Item
                    name="expiration_date"
                    label="Ngày Hết Hạn"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </>
              )}
            </Form>
          </Modal>

      </div>
    </Layout>
  );
}
export default ManageIngredient;