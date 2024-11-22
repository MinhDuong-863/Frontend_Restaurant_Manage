import { useLocation } from "react-router-dom";
import React from "react";
import { Badge, Descriptions, Flex, Typography } from "antd";
import styles from "./BookingDetails.module.scss";
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
  return (
    <div className={styles["page"]}>
      <Flex vertical gap={20}>
        <Text className={styles["title"]} clas level={3}>Chi tiết Booking</Text>

        <div className={styles["content"]}>
          <Descriptions title={<div className={styles["header-1"]}>Thông tin đặt bàn</div>} bordered items={items} />
        </div>
        <div className={styles["header-1"]}>Gọi món</div>

      </Flex>

    </div>
  )
};

export default BookingDetails;
