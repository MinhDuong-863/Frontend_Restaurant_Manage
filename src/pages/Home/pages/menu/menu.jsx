import { useState, useEffect } from 'react';
import './Menu.scss';
import { TYPE_OF_FOOD } from '../../../../constant/values';
import { Pagination, Select } from 'antd';
import { getAllFood } from '../../../../services/userService';
import MenuItem from './menuItem/menuItem';

const MenuPage = () => {
    const [selectedFoodType, setSelectedFoodType] = useState('');
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(16);
    const [total, setTotal] = useState(0);
  
    const onFoodTypeChange = (value) => {
      setSelectedFoodType(value);
    };
  
    const onSearchChange = (e) => {
      setSearch(e.target.value);
    };
  
    const handlePageChange = (page, pageSize) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    };
  
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const { data, totalItem } = await getAllFood(
          currentPage,
          pageSize,
          search,
          selectedFoodType,
          'active'
        );
        setFoods(data);
        setTotal(totalItem);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
        fetchFoods();
    }, [currentPage, pageSize, search, selectedFoodType]);
  
    return (
      <div className="menu-container">
        <div className="menu-content">
          
          <div className="row menu-header">
                <h1>Danh sách món ăn</h1>
                <p style={{textAlign: 'justify'}}>
                    Hãy thưởng thức những món ăn ngon miệng từ nhà hàng chúng tôi, nơi tinh hoa ẩm thực và dịch vụ đẳng cấp hòa quyện, để cùng tạo nên những trải nghiệm tuyệt vời cho thực khách!
                </p>
          </div>
  
          <div className="row mt-3 menu-action">
            <div className="col-8">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn"
                className="input-search"
                style={{ width: '100%', height: '3em' }}
                value={search}
                onChange={onSearchChange}
              />
            </div>
            <div className="col-4">
              <Select
                showSearch
                placeholder="Chọn loại món ăn"
                optionFilterProp="label"
                onChange={onFoodTypeChange}
                value={selectedFoodType}
                options={TYPE_OF_FOOD}
                style={{ width: '100%', height: '3em' }}
              />
            </div>
          </div>
  
          <div className="menu-list mt-3 d-flex flex-wrap">
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : foods.length === 0 ? (
              <p>Không có món ăn nào phù hợp</p>
            ) : (
              foods.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))
            )}
          </div>
          <div className="row mt-3">
            <Pagination
              align="center"
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  };

export default MenuPage;