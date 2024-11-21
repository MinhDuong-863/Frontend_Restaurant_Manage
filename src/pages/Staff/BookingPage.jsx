import { Button, Flex, Form, Input, message, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { searchBooking } from "../../services/callAPI";
import FoodItem from "../../components/FoodItem";
import { useEffect, useState } from "react";

const { Title } = Typography;
const BookingPage = () => {
    const [ListBooking, setListBooking] = useState([])
    const onSubmit = (values) => {
        searchBooking(values).then((res) => {
            if (res.EC === 0) {
                message.success(res.EM)
                setListBooking(res.DT)
            }
            else {
                message.error(res.EM)
            }
        })
    }
    useEffect(() => {
        console.log(ListBooking)
    }, [ListBooking])
    return (
        <Flex vertical>
            <Flex justify="space-between" align="center">
                <Title level={2}>Danh sách đặt trước</Title>
                <Form size="large" onFinish={onSubmit} layout="inline">
                    <Form.Item name="phone_number" rules={
                        [
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại khách hàng"
                            }
                        ]
                    }>
                        <Input placeholder="Nhập số điện thoại của khách hàng" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit"> <SearchOutlined />Tìm kiếm</Button>
                    </Form.Item>
                </Form>
            </Flex >
            {/* <FoodItem
                foodId="1"
                foodName="Phở Bò"
            /> */}
            {/* <FoodItem /> */}
        </Flex >
    );
}
export default BookingPage;