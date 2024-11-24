import { DatePicker, Form, Input, message, Modal, Pagination } from 'antd';
import './Account.scss'
import { useEffect, useState } from 'react';
import TableItem from './tableItem/tableItem';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, getBookings, updateBooking } from '../../../../services/userService';
import { setInformation } from '../../../../redux/action/authenSlice';
import Promotion from './promotionModal/promotion';

const Account = () => {
    const dispatch = useDispatch();
    const inforUser = useSelector(state => state.authen.user);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const [bookingList, setBookingList] = useState([]);
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const closePromotionModal = () => setIsPromotionModalOpen(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data, total } = await getBookings(currentPage, pageSize, selectedDate);
            setBookingList(data);
            setTotal(total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recruitments:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [selectedDate, currentPage, pageSize]);

    const onDateChange = (value) => {
        setSelectedDate(value);
    }

    const onClose = () => {
        form.resetFields();
        setIsOpen(false);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);  
        setPageSize(pageSize);  
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const response = await updateUser(inforUser._id, values);
            
            if (response?.EC === 0) {
                message.success("Cập nhật thông tin thành công!");
                
                // Cập nhật thông tin mới vào Redux store
                const updatedUserInfo = {
                    ...inforUser,
                    ...values
                };
                dispatch(setInformation(updatedUserInfo));
                
                onClose();
            } else {
                message.error(response?.EM || "Cập nhật thất bại!");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Có lỗi xảy ra khi cập nhật thông tin!");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            setLoading(true);
            const response = await updateBooking(id, { status: 'cancelled' });
            if (response?.EC === 0) {
                message.success("Hủy đặt bàn thành công!");
                fetchBookings();
            } else {
                message.error(response?.EM || "Hủy đặt bàn thất bại!");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            message.error("Có lỗi xảy ra khi hủy đặt bàn!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='account-container'>
            <div className='account-header text-center'>
                <p>Thông tin cá nhân</p>
            </div>
            <div className='profile-container row'>
                <div className='col-1'/>
                <div className='profile-image text-center col-3'>
                    <img src={inforUser.avatar} alt="avatar" />
                </div>
                <div className='profile-info mt-3 col-4'>
                    <div className='profile-info-item '>
                        <span className='profile-info-item-label'>Họ và tên:</span>
                        <span className='profile-info-item-value ms-3'>
                            {inforUser.last_name + ' ' + inforUser.first_name}
                        </span>
                    </div>
                    <div className='profile-info-item mt-3'>
                        <span className='profile-info-item-label'>Số điện thoại:</span>
                        <span className='profile-info-item-value ms-3'>{inforUser.phone_number}</span>
                    </div>
                    <div className='profile-info-item mt-3'>
                        <span className='profile-info-item-label'>Email:</span>
                        <span className='profile-info-item-value ms-3'>{inforUser.email}</span>
                    </div>
                    <div className='profile-info-item mt-3'>
                        <span className='profile-info-item-label'>Địa chỉ:</span>
                        <span className='profile-info-item-value ms-3'>{inforUser.address}</span>
                    </div>
                </div>
                <div className='profile-info mt-3 col-4'>
                    <div className='profile-info-item'>
                        <span className='profile-info-item-label'>Điểm của bạn:</span>
                        <span className='profile-info-item-value ms-3'>{inforUser.point}</span>
                    </div>
                    <div className='profile-info-item mt-3'>
                        <button className='btn-promotion' onClick={() => setIsPromotionModalOpen(true)}>Danh sách khuyến mại</button>
                    </div>
                    <div className='profile-info-item mt-3'>
                        <button className='btn-update' onClick={() => setIsOpen(true)}>
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>
            <div className='account-header text-center'>
                <p>Danh sách bàn đã đặt</p>
            </div>
            <div className='table-list-container'>
                <div className='filter-container row justify-content-center'>  
                    <div className='col-2 text-end' style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'end'
                    }}>
                        <p>Tìm kiếm theo ngày đặt:</p>
                    </div>
                    <div className='col-2'>
                        <DatePicker
                            value={selectedDate} 
                            onChange={onDateChange}
                            style={{width: '100%', height: '3em'}}
                        />
                    </div>
                </div>
                <div className='table-list-content mt-3 row'>
                    {bookingList && bookingList.map((table, index) => (
                        <TableItem key={index} table={table} onCancel={() => handleCancel(table._id)}/>
                    ))}
                </div>
                <div className='row mt-3'>
                    <Pagination
                        align="center"
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                    />
                </div> 
            </div>
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                visible={isOpen}
                onCancel={onClose}
                onOk={handleUpdate}
                confirmLoading={loading}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" initialValues={inforUser}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Form.Item
                            label="Họ và tên đệm"
                            name="last_name"
                            rules={[{ required: true, message: "Vui lòng nhập họ và tên đệm!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập họ và tên đệm" />
                        </Form.Item>
                        <Form.Item
                            label="Tên"
                            name="first_name"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập tên" />
                        </Form.Item>
                    </div>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone_number"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                </Form>
            </Modal>
            <Promotion 
                isOpen={isPromotionModalOpen}
                onClose={closePromotionModal}
            />
        </div>
    )
}

export default Account;