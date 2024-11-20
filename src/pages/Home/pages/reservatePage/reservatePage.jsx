import { DatePicker, Select } from 'antd';
import './ReservatePage.scss';
import { TIME_ZONE } from '../../../../constant/timezone';
import { useState } from 'react';

const ReservatePage = () => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const onTimeChange = (value) => {
        setSelectedTime(value);
    }

    const onDateChange = (value) => {
        setSelectedDate(value);
    }

   return (
        <div className="reservate-page-container">
            <div className='reservate-page-title row'>
                <h1>Đặt bàn ngay</h1>
                <p>Hãy đặt bàn trước để chúng tôi có thể chuẩn bị mọi thứ chu đáo, mang đến cho bạn một trải nghiệm ẩm thực hoàn hảo nhất. Chúng tôi luôn sẵn sàng phục vụ bạn với chất lượng tốt nhất và sự chăm sóc tận tình.</p>
            </div>
            <div className='reservate-page-form row'>
                <div className='col-7'>
                    <div className='row'>
                        <div className='col-6'>
                            <div className='row'>
                                <div className='col-5'>
                                    <label>Ngày:</label>
                                </div>
                                <div className='col-7'>
                                    <DatePicker
                                        value={selectedDate} 
                                        onChange={onDateChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='row'>
                                <div className='col-5'>
                                    <label>Giờ:</label>
                                </div>
                                <div className='col-7'>
                                    <Select
                                        showSearch
                                        placeholder="Chọn thời gian"
                                        optionFilterProp="label"
                                        onChange={onTimeChange}
                                        value={selectedTime}
                                        options={TIME_ZONE}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-6'>
                            <div className='row'>
                                <div className='col-5'>
                                    <label>Số lượng người:</label>
                                </div>
                                <div className='col-7'>
                                    <input type='number' min='1' className='input-reservate'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   )

}

export default ReservatePage;