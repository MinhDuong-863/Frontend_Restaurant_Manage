import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import BookingModal from '../bookingModal/bookingModal';
import './OrderModal.scss';

const OrderModal = ({ isOpen, onClose, selectedFoods, setSelectedFoods }) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [tempFoods, setTempFoods] = useState([...selectedFoods]);

    useEffect(() => {
        if (isOpen) {
            setTempFoods([...selectedFoods]);
        }
    }, [isOpen, selectedFoods]);


    const handleQuantityChange = (_id, newQuantity) => {
        if (newQuantity >= 0) {
            setTempFoods(prev =>
                prev.map(food =>
                    food._id === _id
                        ? { ...food, quantity: newQuantity }
                        : food
                )
            );
        }
    };

    const handleRemoveFood = (_id) => {
        setTempFoods(prev => prev.filter(food => food._id !== _id));
    };

    const calculateTotal = () => {
        return selectedFoods.reduce((total, food) => {
            return total + (food.price * food.quantity);
        }, 0);
    };

    const openBookingModal = () => {
        setIsBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
    };

    const handleFoodSelect = (newFood) => {
        setSelectedFoods((prev) => {
            const existingFood = prev.find((food) => food._id === newFood._id);

            if (existingFood) {
                return prev.map((food) =>
                    food._id === newFood._id
                        ? { ...food, quantity: food.quantity + 1 }
                        : food
                );
            }
            return [...prev, { ...newFood, _id: newFood._id, quantity: 1 }];
        });
        closeBookingModal();
    };

    const handleOrderConfirm = () => {
        setSelectedFoods(tempFoods); // Lưu danh sách món ăn đã chỉnh sửa

        onClose(); // Đóng modal
    };


    return (
        <>
            <Modal
                title="Danh sách món đã chọn"
                closeIcon={null}
                open={isOpen}
                onCancel={onClose}
                width={800}
                footer={null}
                className="order-modal"
            >
                <div className="order-container">
                    <div className="order-list">
                        {selectedFoods.length === 0 ? (
                            <div className="empty-order">
                                <p>Chưa có món ăn nào được chọn</p>
                                <button className="btn-add me-3" onClick={openBookingModal}>
                                    Thêm món
                                </button>
                                <button className="btn-cancel" onClick={onClose}>
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <>
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Món ăn</th>
                                            <th>Đơn giá</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tempFoods.map(food => (
                                            <tr key={food._id}>
                                                <td className="food-info">
                                                    <div>
                                                        <img src={food.image} alt={food.name} style={{ marginRight: '10px' }} />
                                                        <span>{food.name}</span>
                                                    </div>
                                                </td>
                                                <td>{food.price.toLocaleString('vi-VN')}đ</td>
                                                <td className="quantity-cell ">
                                                    <div className='quantity'>
                                                        <button
                                                            className="quantity-btn"
                                                            onClick={() => handleQuantityChange(food._id, food.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={food.quantity}
                                                            onChange={(e) => handleQuantityChange(food._id, parseInt(e.target.value) || 0)}
                                                            min="1"
                                                        />
                                                        <button
                                                            className="quantity-btn"
                                                            onClick={() => handleQuantityChange(food._id, food.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>{(food.price * food.quantity).toLocaleString('vi-VN')}đ</td>
                                                <td>
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => handleRemoveFood(food._id)}
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="order-summary">
                                    <button className="btn-add" onClick={openBookingModal}>
                                        Thêm món
                                    </button>
                                    <div className="total">
                                        <span>Tổng cộng:</span>
                                        <span className="total-amount">
                                            {calculateTotal().toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-9' />
                                    <div className='col-1' style={{ padding: '0' }}>
                                        <div className="order-actions me-1">
                                            <button className="btn-cancel" onClick={onClose}>Hủy</button>
                                        </div>
                                    </div>
                                    <div className='col-2'>
                                        <div className="order-actions">
                                            <button className="btn-confirm" onClick={handleOrderConfirm}>Xác nhận</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={closeBookingModal}
                onFoodSelect={handleFoodSelect}
            />
        </>
    );
};

OrderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedFoods: PropTypes.array.isRequired,
    setSelectedFoods: PropTypes.func.isRequired
};

export default OrderModal;