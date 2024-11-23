import { Pagination, Select } from 'antd';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllFood } from '../../../../../services/userService';
import FoodItem from '../foodItem/foodItem';
import './BookingModal.scss';
import { TYPE_OF_FOOD } from '../../../../../constant/values';

const BookingModal = ({ isOpen, onClose, onFoodSelect }) => {
  const [selectedFoodType, setSelectedFoodType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
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
    if (isOpen) {
      fetchFoods();
    }
  }, [currentPage, pageSize, search, selectedFoodType, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="booking-modal">
      <div className="booking-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        
        <div className="row booking-header">
          <h2>Chọn món ăn</h2>
        </div>

        <div className="row mt-3 booking-action">
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
              options={TYPE_OF_FOOD}
              style={{ width: '100%', height: '3em' }}
            />
          </div>
        </div>

        <div className="row booking-list justify-content-center">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : foods.length === 0 ? (
            <p>Không có món ăn nào phù hợp</p>
          ) : (
            foods.map((item) => (
              <FoodItem
                key={item._id}
                foodItem={item}
                onFoodSelect={onFoodSelect}
              />
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

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFoodSelect: PropTypes.func.isRequired
};

export default BookingModal;