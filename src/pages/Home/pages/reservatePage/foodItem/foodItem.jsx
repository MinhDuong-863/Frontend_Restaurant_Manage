import PropTypes from 'prop-types';
import './FoodItem.scss';

const FoodItem = ({ foodItem, onFoodSelect }) => {
  return (
    <div className="col-12">
      <div className="food-item mt-3 row">
        <div className='col-2 food-image-container'>
          <img src={foodItem.image} alt={foodItem.name} className="food-item-image" />
        </div>
        <div className='col-7 food-details-container'>
          <div className="food-item-details">
            <h3 className="food-item-name text-truncate">{foodItem.name}</h3>
            <p className="food-item-price">{foodItem.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
            <p className="food-item-category">Loại: {foodItem.type}</p>
          </div>
        </div>
        <div className='col-3 d-flex align-items-center justify-content-end'>
          <div className="food-item-button">
            <button className="btn-book" onClick={() => onFoodSelect(foodItem)}>
              Chọn món
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  foodItem: PropTypes.object.isRequired,
  onFoodSelect: PropTypes.func.isRequired
};

export default FoodItem;