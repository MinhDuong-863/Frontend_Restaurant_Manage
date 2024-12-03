import React, { useState, useEffect } from 'react';
import { CiImport, CiExport } from "react-icons/ci";
import { getAllIngredientApi } from '../../services/apiService';
import clientApi from '../../client-api/rest-client-api';
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
  Upload,
  Tabs
} from 'antd';
import {
  DatabaseOutlined,
  StockOutlined,
  AlertOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined
} from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import { formatDate } from '../../utils/format';

const { Option } = Select;

const ManageIngredient = () => {
  const [materials, setMaterials] = useState([]);
  const [expiredMaterials, setExpiredMaterials] = useState([]);
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
  const [lowStockMaterials, setLowStockMaterials] = useState(0);


  const handleDeleteMaterial = async (record) => {
    try {
      console.log('record', record);
      const response = await clientApi.service('/ingredients').delete(record.id);

      if (response.EC === 0) {
        message.success(`Xóa ${record.name} thành công`);
        getAllIngredient();
      } else {
        message.error(response.EM || 'Xóa nguyên liệu không thành công');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      message.error('Đã có lỗi xảy ra khi xóa nguyên liệu');
    }
  };
  const handleAddMaterial = async () => {
    try {
      const values = await form.validateFields();

      const newIngredientData = {
        name: values.name,
        unit: values.unit,
        type: values.type,
        description: values.description || '',
      };

      const response = await clientApi.service('/ingredients').create(newIngredientData);
      if (response.EC === 0) {
        message.success(`Thêm ${values.name} thành công`);
        setIsModalVisible(false);
        getAllIngredient();
      }
    } catch (error) {
      console.error('Error adding material:', error);
      message.error('Vui lòng kiểm tra lại thông tin');
    }
  };
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
        id: ingredient._id,
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

  const getExpiredMaterials = async () => {
    try {
      setLoading(true);
      const response = await clientApi.service('/ingredients/expired').find({
        page: 1,
        limit: 5
      });
      const expiredList = response?.DT?.data || [];
      console.log('expired ingredients', expiredList);
      setLowStockMaterials(response.DT.totalItems);
      const formattedData = expiredList.map((expired) => {
        return {
          ingredientName: expired.ingredientName,
          expirationDate: formatDate(expired.expirationDate),
          quantity: expired.quantity,
          supplier: expired.supplier
        }
      });
      setExpiredMaterials(formattedData);
    } catch (error) {
      message.error('Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getExpiredMaterials();
  }, []);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  const handleImportMaterial = async () => {
    try {
      const values = await form.validateFields();

      const importData = {
        ingredient_id: currentMaterial.id,
        quantity: + values.quantity,
        supplier: values.supplier,
        price: values.price,
        expiration_date: values.expiration_date,
        type: 'import'
      };
      console.log('importData', importData);
      const response = await clientApi.service('/update-ingredients').put(currentMaterial.id, importData);
      console.log('response', response);
      if (response.EC === 0) {
        message.success(`Nhập ${currentMaterial.name} thành công`);
        getAllIngredient(); // Refresh ingredient list
        getExpiredMaterials(); // Update expired materials
        setIsImportExportModalVisible(false);
      } else {
        message.error(response.EM || 'Nhập nguyên liệu không thành công');
      }
    } catch (error) {
      console.error('Error importing material:', error);
      message.error('Vui lòng kiểm tra lại thông tin');
    } finally {
      setLoading(false);
    }
  };
  const handleExportMaterial = async () => {
    try {
      const values = await form.validateFields();

      const importData = {
        ingredient_id: currentMaterial.id,
        quantity: + values.quantity,
        type: 'export'
      };
      const response = await clientApi.service('/update-ingredients').put(currentMaterial.id, importData);
      if (response.EC === 0) {
        message.success(`Xuất ${currentMaterial.name} thành công`);
        getAllIngredient(); // Refresh ingredient list
        getExpiredMaterials(); // Update expired materials
        setIsImportExportModalVisible(false);
      } else {
        message.error(response.EM || 'Xuất nguyên liệu không thành công');
      }
    } catch (error) {
      console.error('Error importing material:', error);
      message.error('Vui lòng kiểm tra lại thông tin');
    } finally {
      setLoading(false);
    }
  };

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
              handleDeleteMaterial(record);
            }}
          >
          </Button>
        </div>
      )
    }
  ];
  const expiredTableColumns = [
    {
      title: 'Tên Nguyên Liệu',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
      width: 150,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Ngày Hết Hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      width: 150,
    },
    {
      title: 'Số Lượng',
      key: 'quantity',
      render: (record) => (
        <div>
          <span style={{ color: record.quantity < 10 ? 'red' : 'green' }}>
            {record.quantity}
          </span>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 150,
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
                background: 'green',
                color: 'white'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white' }}>Tổng Số Nguyên Liệu</span>}
                value={totalIngredients}
                prefix={<DatabaseOutlined style={{ color: 'white' }} />}
                valueStyle={{ color: 'white' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                background: '#DAE15B',
                color: 'white'
              }}
            >
              <Statistic
                title={<span style={{ color: 'white' }}>Nguyên Liệu Hết Hạn</span>}
                value={lowStockMaterials}
                prefix={<AlertOutlined style={{ color: 'white' }} />}
                valueStyle={{ color: lowStockMaterials > 0 ? 'red' : 'white' }}
              />
            </Card>
          </Col>


          {/* Bảng chi tiết */}


          <Col span={24}>
            <Card>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Tất Cả Nguyên Liệu" key="1">
                  <div style={{ marginBottom: 16 }}>
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
                  </div>
                  <Table
                    columns={tableColumns}
                    dataSource={materials}
                    rowKey="id"
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <WarningOutlined style={{ color: '#ff4d4f' }} />
                      Nguyên Liệu Hết Hạn ({expiredMaterials.length})
                    </span>
                  }
                  key="2"
                >
                  <Table
                    columns={expiredTableColumns}
                    dataSource={expiredMaterials}
                    rowKey="id"
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nguyên liệu hết hạn`
                    }}
                  />
                </TabPane>
              </Tabs>
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
              name="unit"
              label="Đơn Vị"
              rules={[{ required: true, message: 'Nhập đơn vị' }]}
            >
              <Select placeholder="Chọn đơn vị">
                <Option value="kg">Kg</Option>
                <Option value="l">Lít</Option>
                <Option value="khác">Khác</Option>
              </Select>
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
          okText="Cập nhật"
          cancelText="Hủy"
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

            {operationType === 'import' && (
              <>
                <Form.Item
                  name="supplier"
                  label="Nhà Cung Cấp"
                  rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp!' }]}
                >
                  <Input />
                </Form.Item>
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
};
export default ManageIngredient;