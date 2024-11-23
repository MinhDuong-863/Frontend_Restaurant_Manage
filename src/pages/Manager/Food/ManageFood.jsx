import React, { useState, useEffect, useCallback } from 'react';
import { Input, Card, Button, message, Space, Pagination, Spin, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FoodItemManagement from './FoodItem';
import { getAllFood } from '../../../services/userService';
import { TYPE_OF_FOOD } from '../../../constant/values';
import './ManageFood.scss';
import CreateFoodModal from './ModalFood';
import UpdateFoodModal from './UpdateFood';
const { Search } = Input;
const { Option } = Select;

const INITIAL_PAGINATION = {
  current: 1,
  pageSize: 10,
  total: 0
};

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const fetchFoods = async (params = {}) => {
    const {
      page = pagination.current,
      pageSize = pagination.pageSize,
      search = searchTerm,
      foodType = selectedFoodType
    } = params;

    setLoading(true);
    try {
      const { data, totalItem } = await getAllFood(
        page,
        pageSize,
        search,
        foodType,
        'active'
      );
      console.log(totalItem);

      setFoods(data || []);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: totalItem || 0
      }));
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách món ăn');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [pagination.current, pagination.pageSize, searchTerm, selectedFoodType]);

  const handlePageChange = (page, pageSize) => {
    fetchFoods({ page, pageSize });
  };
  const handleCreateClick = () => {
    setIsCreateModalVisible(true);
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset về trang 1 khi search
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleFoodTypeChange = (value) => {
    setSelectedFoodType(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedFoodType('');
    setPagination(INITIAL_PAGINATION);
    fetchFoods({
      page: 1,
      search: '',
      foodType: ''
    });
  };

  const handleFoodSelect = (foodItem) => {
    setSelectedFood(foodItem);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedFood(null);
  };

  const renderFilters = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      gap: '16px',
      alignItems: 'center'
    }}>
      <Space size="middle" style={{ flex: 1 }}>
        <Input
          placeholder="Tìm kiếm món ăn"
          prefix={<SearchOutlined />}
          allowClear
          value={searchTerm}
          onChange={handleSearch}
          onPressEnter={() => fetchFoods()}
          style={{ height: '3em' }}
        />
        <Select
          showSearch
          placeholder="Chọn loại món ăn"
          optionFilterProp="label"
          value={selectedFoodType}
          onChange={handleFoodTypeChange}
          options={TYPE_OF_FOOD}
          style={{ minWidth: '200px', height: '3em' }}
          allowClear
        />
      </Space>
  
      <Button
        type="primary"
        className='btn-create'
        onClick={handleCreateClick}
        style={{ height: '3em' }}
      >
        Tạo món ăn
      </Button>
    </div>
  );

  const renderFoodGrid = () => (
    <div className="container">
      <div className="row g-4">
        {foods.map((food) => (
          <div key={food._id} className="col-12 col-sm-6 col-lg-4">
            <FoodItemManagement
              foodItem={food}
              onFoodSelect={handleFoodSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPagination = () => (
    <div className="d-flex justify-content-center mt-4">
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        showTotal={(total) => `Tổng ${total} món ăn`}
      />
    </div>
  );

  return (
    <Card 
      title="Quản Lý Món Ăn" 
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
        >
          Làm mới
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {renderFilters()}
        
        <Spin spinning={loading}>
          {foods.length > 0 ? (
            renderFoodGrid()
          ) : (
            <div className="text-center py-5">
              Không tìm thấy món ăn nào
            </div>
          )}
        </Spin>

        {foods.length > 0 && renderPagination()}
      </Space>
      <CreateFoodModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={() => {
          setIsCreateModalVisible(false);
          fetchFoods(); 
        }}
      />
      <UpdateFoodModal
        visible={isUpdateModalVisible}
        onCancel={handleUpdateModalClose}
        onSuccess={() => {
          handleUpdateModalClose();
          fetchFoods();
        }}
        initialData={selectedFood}
      />
    </Card>
  );
};

export default FoodManagement;