import PropTypes from 'prop-types';
import './TableItem.scss'
import { formatDate2 } from '../../../../../utils/format';
import { Modal } from 'antd';
import { useState } from 'react';

const TableItem = ({table, onCancel}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const checkTimeDifference = (tableTime) => {
        const currentTime = new Date();
        const tableTimeParts = tableTime.split(':');
        const tableDate = new Date(currentTime.setHours(tableTimeParts[0], tableTimeParts[1], 0, 0));
    
        // Tính toán sự chênh lệch giữa thời gian hiện tại và giờ đặt
        const timeDifference = tableDate - new Date();
        const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 tiếng đổi sang ms
    
        return timeDifference < twoHoursInMs && timeDifference > 0;
    };

    const isDisableCancel = checkTimeDifference(table.time);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <>
            <div className="table-item-container mt-3 ms-3 align-items-center row">
                <div className='col-12'>
                    <div className='row' style={{display: 'grid', 
                                                gridTemplateColumns: '2fr 2fr 2fr 2fr 3fr 2fr'}}>
                        <div className='profile-info-item ms-5'>
                            <span className='profile-info-item-label'>Loại bàn:</span>
                            <span className='profile-info-item-value ms-3'>
                                {table.table.type === 'normal' 
                                ? 'Thường' 
                                : table.table.type === 'VIP' 
                                ? 'VIP' 
                                : 'Không xác định'}
                            </span>
                        </div>
                        <div className='profile-info-item ms-5'>
                            <span className='profile-info-item-label'>Khung giờ:</span>
                            <span className='profile-info-item-value ms-3'>{table.time}</span>
                        </div>
                        <div className='profile-info-item ms-5'>
                            <span className='profile-info-item-label'>Ngày đặt:</span>
                            <span className='profile-info-item-value ms-3'>{formatDate2(table.date)}</span>
                        </div>
                        <div className='profile-info-item ms-5'>
                            <span 
                                className='profile-info-item-link'
                                onClick={showModal}
                                style={{ cursor: 'pointer' }}
                            >
                                Danh sách món đã đặt
                            </span>
                        </div>
                        <span
                            className={`profile-info-item-status ${
                            table.status === 'pending'
                                ? 'status-pending'
                                : table.status === 'confirmed'
                                ? 'status-confirmed'
                                : table.status === 'canceled'
                                ? 'status-canceled'
                                : 'status-completed'
                            }`}
                        >
                            {table.status}
                        </span>
                        <div className='profile-info-item'>
                            <button 
                                className={`btn-cancel ms-5 ${isDisableCancel ? 'disabled' : ''} ${
                                    table.status === 'canceled' || table.status === 'completed' ? 'disabled' : ''
                                }`} 
                                disabled={isDisableCancel}
                                onClick={onCancel}
                            >
                                Hủy đặt
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal 
                title="Danh sách món đã đặt" 
                open={isModalOpen} 
                closeIcon={null}
                onOk={handleOk} 
                onCancel={handleCancel}
                width={800}
                className="food-modal"
                footer={[
                    <button
                        key="close"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                    >
                        Đóng
                    </button>
                ]}
            >
                {table.order_detail && table.order_detail.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Hình ảnh</th>
                                    <th scope="col">Tên món</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Đơn giá</th>
                                    <th scope="col">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.order_detail.map((item) => (
                                    <tr key={item.food_id}>
                                        <td>
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatPrice(item.price)}</td>
                                        <td>{formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="4" className="text-end fw-bold">Tổng tiền:</td>
                                    <td className="fw-bold">
                                        {formatPrice(
                                            table.order_detail.reduce(
                                                (total, item) => total + (item.price * item.quantity), 
                                                0
                                            )
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">Chưa có món ăn nào được đặt</p>
                )}
            </Modal>
        </>
    );
}

TableItem.propTypes = {
    table: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default TableItem;