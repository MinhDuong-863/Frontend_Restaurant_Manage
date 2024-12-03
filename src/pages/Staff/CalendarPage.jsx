import React, { useEffect, useState } from "react";
import { Calendar, Typography, Badge, message, Flex, Button } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import './CalendarPage.scss';
import clientApi from "../../client-api/rest-client-api.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constant/path.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Text } = Typography;




const CalendarPage = () => {
    // Danh sách dữ liệu
    const [shiftData, setShiftData] = useState([]);
    // const user = useSelector(state => state.authen.user);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const staff = useSelector(state => state.staff);
    // Hàm lấy dữ liệu từ shiftData
    const getListData = (value) => {
        const dateStr = dayjs(value).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
        const events = shiftData.filter(item =>
            dayjs(item.date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD") === dateStr
        );

        return events.map(event => ({
            type: 'success', // Bạn có thể thay đổi type tùy ý
            content: `Ca thứ ${event.shift_number}`
        }));
    };

    // Hiển thị dữ liệu sự kiện
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => (
                    <div key={index}>
                        <Badge status={item.type} text={item.content} />
                    </div>
                ))}
            </ul>
        );
    };
    useEffect(() => {

        clientApi.service('shift').get(staff._id).then(res => {
            if (res.EC === 0) {
                setShiftData(res.DT);
                message.success(res.EM);
            }
        });
    }, []);
    useEffect(() => {
        console.log(shiftData);
    }, [shiftData]);
    const handleSelect = (date) => {
        setSelectedDate(date);
        console.log('Ngày được chọn:', date); //dayjs
    };
    const handleOff = () => {
        // chuyển trang đến trang xin nghỉ phép
        navigate(PATHS.STAFF.OFF);
    }
    const handleCheckIn = () => {
        clientApi.service('time-keepings/check-in').put(staff._id, {}).then(res => {
            if (res.EC === 0) {
                message.success(res.EM);
            }
            else {
                message.error(res.EM);
            }
        });
    }
    const handleCheckOut = () => {
        clientApi.service('time-keepings/check-out').put(staff._id, {}).then(res => {
            if (res.EC === 0) {
                message.success(res.EM);
            }
            else {
                message.error(res.EM);
            }
        });
    }
    return (
        <div style={{ padding: 20 }}>
            <Flex justify="space-between" align="center">
                <Text className="title" level={2}>Lịch làm việc</Text>
                <Flex gap={8}>
                    <Button onClick={handleOff} size="large" type="default">Xin nghỉ phép</Button>
                    <Button className="btn-check-in-out" onClick={handleCheckIn} size="large" type="primary">Chấm công vào</Button>
                    <Button className="btn-check-in-out" onClick={handleCheckOut} size="large" type="primary">Chấm công ra</Button>
                </Flex>
            </Flex>
            <Flex justify="center" className="mt-2">
                <Calendar onSelect={handleSelect} style={{ width: "80%" }} cellRender={dateCellRender} />
            </Flex>
        </div>
    );
};

export default CalendarPage;
