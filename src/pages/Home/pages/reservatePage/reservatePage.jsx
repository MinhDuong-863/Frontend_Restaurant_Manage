import { DatePicker, message, Select } from 'antd';
import './ReservatePage.scss';
import { TABLE_TYPES, TIME_ZONE } from '../../../../constant/values';
import { useState } from 'react';
import BookingModal from './bookingModal/bookingModal';
import OrderModal from './orderModal/orderModal';
import { bookingTable } from '../../../../services/userService';
import FoodItemView from './foodItemSusscess/foodItemView';

const ReservatePage = () => {
    const [reservationSuccess, setReservationSuccess] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [note, setNote] = useState('');

    const onTimeChange = (value) => {
        setSelectedTime(value);
    }

    const onDateChange = (value) => {
        setSelectedDate(value);
    }

    const onTableChange = (value) => {
        setSelectedTable(value);
    }

    const onNumberOfPeopleChange = (e) => {
        setNumberOfPeople(e.target.value);
    }

    const onNoteChange = (e) => {
        setNote(e.target.value);
    }

    //modal order
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedFoods, setSelectedFoods] = useState([]);

    const closeOrderModal = () => setIsOrderModalOpen(false);

    //modal booking
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const handleFoodSelect = (food) => {
        setSelectedFoods(prev => {
            const existingFood = prev.find(f => f._id === food._id);
            if (existingFood) {
                return prev.map(f => 
                    f._id === food._id 
                        ? { ...f, quantity: f.quantity + 1 }
                        : f
                );
            }
            return [...prev, { ...food, quantity: 1 }];
        });
        setIsBookingModalOpen(false);
        setIsOrderModalOpen(true);
    };

    const getSelectedFoodsMinimal = () => {
        return selectedFoods.map(food => ({
            food_id: food._id,         // Chỉ lấy `id` từ `_id`
            quantity: food.quantity // Giữ nguyên `quantity`
        }));
    };

    const handleButtonReservateClick = async () => {
        try {
            if (!selectedDate || !selectedTime || !selectedTable || !numberOfPeople) {
                message.error('Vui lòng điền đầy đủ thông tin!');
                return;
            }
    
            let seats = 0;
    
            if (numberOfPeople < 10) {
                seats = 10;
            } else if (numberOfPeople < 20) {
                seats = 20;
            } else if (numberOfPeople < 30) {
                seats = 30;
            } else {
                message.error('Số lượng người quá lớn, vui lòng đặt 2 bàn!');
                return;
            }
    
            const table = {
                type: selectedTable,
                seats: seats,
            };
            const order_detail = getSelectedFoodsMinimal();
            const booking = {
                date: selectedDate,
                time: selectedTime,
                note: note,
                order_detail: order_detail,
            };
            const data = {
                booking,
                table,
            };
    
            const response = await bookingTable(data);
            if (response.EC === 0) {
                message.success('Đặt bàn thành công');
                setReservationSuccess({
                    selectedDate,
                    selectedTime,
                    selectedTable,
                    numberOfPeople,
                    note,
                    selectedFoods,
                });
            } else {
                message.error('Đặt bàn không thành công');
            }
        } catch (error) {
            console.log(error);
            message.error('Đặt bàn không thành công');
        }
    };

   return (
    <>  
        {reservationSuccess ? (
            <div className="reservation-summary row mt-5">
                <h3>Thông tin đặt bàn của bạn:</h3>
                <div className='row'>
                    <div className='col-3'>
                        <p>Ngày: {reservationSuccess.selectedDate?.format('DD/MM/YYYY')}</p>
                    </div>
                    <div className='col-3'>
                        <p>Giờ: {reservationSuccess.selectedTime}</p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-3'>
                        <p>Loại bàn: {reservationSuccess.selectedTable}</p>
                    </div>
                    <div className='col-3'>
                        <p>Số lượng người: {reservationSuccess.numberOfPeople}</p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <p>Ghi chú: {reservationSuccess.note}</p>
                    </div>
                </div>
                <div className='row seleted-food'>
                    <h4>Món đã chọn:</h4>
                    <ul>
                        {reservationSuccess.selectedFoods.map((food) => (
                            <FoodItemView 
                                key={food._id} 
                                food={food} 
                            />
                        ))}
                    </ul>
                </div>
            </div>
        ):(
            <div className="reservate-page-container">
                <div className='reservate-page-title row'>
                    <h1>Đặt bàn ngay</h1>
                    <p style={{textAlign: 'justify'}}>Hãy đặt bàn trước để chúng tôi có thể chuẩn bị mọi thứ chu đáo, mang đến cho bạn một trải nghiệm ẩm thực hoàn hảo nhất. Chúng tôi luôn sẵn sàng phục vụ bạn với chất lượng tốt nhất và sự chăm sóc tận tình.</p>
                </div>
                <div className='reservate-page-form row'>
                    <div className='col-12 col-lg-7'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-5 d-flex align-items-center'>
                                        <label>Ngày:</label>
                                    </div>
                                    <div className='col-7 d-flex align-items-center'>
                                        <DatePicker
                                            value={selectedDate} 
                                            onChange={onDateChange}
                                            style={{width: '100%', height: '3em'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-5 d-flex align-items-center'>
                                        <label>Giờ:</label>
                                    </div>
                                    <div className='col-7 d-flex align-items-center'>
                                        <Select
                                            showSearch
                                            placeholder="Chọn thời gian"
                                            optionFilterProp="label"
                                            onChange={onTimeChange}
                                            value={selectedTime}
                                            options={TIME_ZONE}
                                            style={{width: '100%', height: '3em'}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-5 d-flex align-items-center'>
                                        <label>Chọn loại bàn:</label>
                                    </div>
                                    <div className='col-7 d-flex align-items-center'>
                                        <Select
                                            showSearch
                                            placeholder="Chọn loại bàn"
                                            optionFilterProp="label"
                                            onChange={onTableChange}
                                            value={selectedTable}
                                            options={TABLE_TYPES}
                                            style={{width: '100%', height: '3em'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-5 d-flex align-items-center'>
                                        <label>Số lượng người:</label>
                                    </div>
                                    <div className='col-7 d-flex align-items-center'>
                                        <input type='number' 
                                            style={{width: '100%', height: '3em'}} min='1' 
                                            className='input-reservate'
                                            value={numberOfPeople}
                                            onChange={onNumberOfPeopleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-12'>
                                <div className='row'>
                                    <div className='col-2'>
                                        <label>Ghi chú:</label>
                                    </div>
                                    <div className='col-10 d-flex justify-content-end'>
                                        <textarea 
                                            className='input-reservate' 
                                            style={{width: '95%'}} rows='5'
                                            value={note}
                                            onChange={onNoteChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-12 d-flex justify-content-end'>
                                <button className='btn-order' onClick={() => setIsOrderModalOpen(true)}>Đặt món</button>
                                <button className='btn-reservate' onClick={handleButtonReservateClick}>Đặt bàn</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-5'>
                        <img style={{width: '100%'}} 
                            src='https://res.cloudinary.com/dup39fo44/image/upload/v1732177249/top-view-dining-table-arrangement_hhjywo.jpg' alt='Image-reservate' ></img>
                    </div>
                </div>
                <BookingModal 
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    onFoodSelect={handleFoodSelect}
                />
                <OrderModal 
                    isOpen={isOrderModalOpen}
                    onClose={closeOrderModal}
                    selectedFoods={selectedFoods}
                    setSelectedFoods={setSelectedFoods}
                />
            </div>
        )}
    </>
   )
}

export default ReservatePage;