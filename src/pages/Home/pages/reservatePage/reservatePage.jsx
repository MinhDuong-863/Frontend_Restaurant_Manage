import { DatePicker, Pagination, Select } from 'antd';
import './ReservatePage.scss';
import { TABLES, TIME_ZONE } from '../../../../constant/values';
import { useEffect, useState } from 'react';
import BookingModal from './bookingModal/bookingModal';
import FoodItem from './foodItem/foodItem';
import { getAllFood } from '../../../../services/userService';

const ReservatePage = () => {
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [selectedFoodType, setSelectedFoodType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [total, setTotal] = useState(0);

    const onFoodTypeChange = (value) => {
        setSelectedFoodType(value);
    }

    const onSeachChange = (e) => {
        setSearch(e.target.value);
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);  
        setPageSize(pageSize);  
    };

    const FoodType = [
        {
            value: '1',
            label: 'Món chính'
        },
        {
            value: '2',
            label: 'Món phụ'
        },
        {
            value: '3',
            label: 'Món tráng miệng'
        }
    ]

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const { data, totalItem } = await getAllFood(currentPage, pageSize, search, selectedFoodType, 'active');
            setFoods(data);
            setTotal(totalItem);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recruitments:', error);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, [currentPage, pageSize, search, selectedFoodType]);

   return (
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
                                    <label>Chọn bàn:</label>
                                </div>
                                <div className='col-7 d-flex align-items-center'>
                                    <Select
                                        showSearch
                                        placeholder="Chọn bàn"
                                        optionFilterProp="label"
                                        onChange={onTableChange}
                                        value={selectedTable}
                                        options={TABLES}
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
                            <button className='btn-order' onClick={openModal}>Đặt món</button>
                            <button className='btn-reservate'>Đặt bàn</button>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-5'>
                    <img style={{width: '100%'}} 
                        src='https://res.cloudinary.com/dup39fo44/image/upload/v1732177249/top-view-dining-table-arrangement_hhjywo.jpg' alt='Image-reservate' ></img>
                </div>
            </div>
            <BookingModal isOpen={isModalOpen} onClose={closeModal}>
                <div className='row booking-header'>
                    <h2>Chọn món ăn</h2>
                </div>
                <div className='row mt-3 booking-action'>
                    <div className='col-8'>
                        <input 
                            type='text' 
                            placeholder='Tìm kiếm món ăn' 
                            style={{width: '100%', height: '3em'}} 
                            value={search}
                            onChange={onSeachChange}
                            className='input-search'/>
                    </div>
                    <div className='col-4'>
                        <Select
                            showSearch
                            placeholder="Chọn vị trí"
                            optionFilterProp="label"
                            onChange={onFoodTypeChange}
                            value={selectedFoodType}
                            options={FoodType}
                            style={{width: '100%', height: '3em'}}
                        />
                    </div>
                </div>
                <div className='row mt-3 booking-list justify-content-center'>
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        foods.map((item) => (
                            <FoodItem
                                key={item.foodId}
                                foodItem={item}
                            />
                        ))
                    )}
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
            </BookingModal>
        </div>
   )

}

export default ReservatePage;