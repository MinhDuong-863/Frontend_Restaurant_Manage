import PropTypes from 'prop-types';
import './FoodItem.scss';

const FoodItem = ({ foodItem }) => {
  return (
    <div className="food-item mt-3 row">
        <div className='col-3 d-flex align-items-center'>
            <img src={foodItem.image} alt={foodItem.name} className="food-item-image" style={{width: '100%', borderRadius: '5px'}} />
        </div>
        <div className='col-6 d-flex align-items-center'>
            <div className="food-item-details">
                <h3 className="food-item-name">{foodItem.name}</h3>
                <p className="food-item-price">{foodItem.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                <p className="food-item-category">{foodItem.category}</p>
            </div>
        </div>
        <div className='col-3  d-flex align-items-end justify-content-end'>
            <div className="food-item-button text-end">
                <button className="btn-book">Chọn món</button>
            </div>
        </div>
      
    </div>
  );
};
FoodItem.propTypes = {
  foodItem: PropTypes.object.isRequired
};

export default FoodItem;
