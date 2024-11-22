import PropTypes from 'prop-types';
import './FoodItemView.scss';

const FoodItemView = ({ food }) => {
    return (
        <div className="food-item-view mt-3">
            <tr key={food._id} className='Item-row'>
                <td className="food-info">
                    <div>
                        <img src={food.image} alt={food.name} style={{marginRight: '10px', width: '70px', height: '70px', objectFit: 'cover'}} />
                        <span>{food.name}</span>
                    </div>
                </td>
                <td>Đơn giá: {food.price.toLocaleString('vi-VN')}đ</td>
                <td>Số lượng: {food.quantity}</td>
                <td>Tổng giá: {(food.price * food.quantity).toLocaleString('vi-VN')}đ</td>
            </tr>
        </div>
    );
};

FoodItemView.propTypes = {
    food: PropTypes.object.isRequired
};

export default FoodItemView;