import { useLocation } from "react-router-dom";
import React from "react";
import { Button, Col, Descriptions, Flex, Row, Typography } from "antd";
import styles from "./BookingDetails.module.scss";
import FoodItem from "../../components/FoodItem";
const { Title, Text } = Typography;

const BookingDetails = () => {
  const location = useLocation();
  const { item } = location.state || {};

  if (!item) {
    return <p>Không có thông tin Booking.</p>;
  }
  const items = [
    {
      key: '1',
      label: 'Tên khách hàng',
      children: item.first_name + " " + item.last_name,
    },
    {
      key: '2',
      label: 'Địa chỉ',
      children: item.address,
    },
    {
      key: '3',
      label: 'Số điện thoại',
      children: item.phone_number,
    },
    {
      key: '4',
      label: 'Tên bàn',
      children: item.booking.table.name,
    },
    {
      key: '5',
      label: 'Thời gian',
      children: item.booking.time + " " + new Date(item.booking.date).toLocaleDateString("vi-VN"),
      span: 2,
    },
    {
      key: '6',
      label: 'Notes',
      children: item.booking.note,
      span: 3,
    }
  ];

  const calculateTotalPrice = (response) => {
    if (!response?.DT || !Array.isArray(response.DT)) {
      return 0; // Trả về 0 nếu response không hợp lệ
    }

    return response.DT.reduce(
      (total, { food_price = 0, quantity = 0 }) => total + food_price * quantity,
      0
    );
  };

  return (
    <div className={styles["page"]}>
      <Flex vertical gap={20}>
        <Text className={styles["title"]} clas level={3}>Chi tiết Booking</Text>

        <div className={styles["content"]}>
          <Descriptions title={<div className={styles["header-1"]}>Thông tin đặt bàn</div>} bordered items={items} />
        </div>
        <div className={styles["header-1"]}>Gọi món</div>
        <Flex gap={"1rem"}>
          <Button className={styles["btn"]}>Thêm món</Button>
          <Button className={styles["btn"]}>Thanh toán</Button>
        </Flex>
        <div>
          <Row>
            <Col span={12}>

            </Col>
            <Col span={12}>
              <FoodItem />
            </Col>
          </Row>

        </div>
      </Flex>

    </div>
  )
};

export default BookingDetails;
