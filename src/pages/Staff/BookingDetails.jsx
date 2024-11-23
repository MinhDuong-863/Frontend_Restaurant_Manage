import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Flex, List, Row, Typography } from "antd";
import styles from "./BookingDetails.module.scss";
import { getListOrder, payment } from "../../services/apiService";
const { Title, Text } = Typography;
const data = [
  {
    name: "Táo",
    food_price: 5000,
    quantity: 10,
  },
  {
    name: "Cam",
    food_price: 7000,
    quantity: 20,
  },
  {
    name: "Chuối",
    food_price: 4000,
    quantity: 15,
  },
];
const BookingDetails = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const [listFood, setListFood] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  if (!item) {
    return <p>Không có thông tin đặt trước.</p>;
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

  const fetchListFood = async () => {
    getListOrder(item.booking._id).then((response) => {
      console.log(response);
      setListFood(response.DT);
    });
  }
  useEffect(() => {
    // Gọi API lấy danh sách món ăn
    fetchListFood();
  }, []);
  useEffect(() => {
    setTotalPrice(calculateTotalPrice(listFood));
  }, [listFood]);

  const calculateTotalPrice = (list) => {
    if (list.length === 0) {
      return 0; // Trả về 0 nếu response không hợp lệ
    }

    return list.reduce(
      (total, { food_price = 0, quantity = 0 }) => total + food_price * quantity,
      0
    );
  };

  const handlePayment = () => {

    payment({
      id: item.booking._id, // id của đơn đặt trước
      total: totalPrice // số tiền
    }).then((response) => {
      console.log(response);
      window.open(response.data.DT.payUrl, '_blank');
    })
  }
  return (
    <div className={styles["page"]}>
      <Flex vertical gap={20}>
        <Text className={styles["title"]} clas level={3}>Chi tiết đặt trước</Text>

        <div className={styles["content"]}>
          <Descriptions title={<div className={styles["header-1"]}>Thông tin đặt bàn</div>} bordered items={items} />
        </div>
        <div className={styles["header-1"]}>Gọi món</div>
        <Flex gap={"1rem"}>
          <Button className={styles["btn"]}>Thêm món</Button>
          <Button onClick={handlePayment} className={styles["btn"]}>Thanh toán</Button>
        </Flex>
        <div>
          <Row>
            <Col span={12}>
              <Title level={4}>Thành tiền</Title>
              <Text>Tổng tiền: {calculateTotalPrice(listFood).toLocaleString("vi-VN")} VNĐ</Text>
            </Col>
            <Col span={12}>
              <Title level={4} >Danh sách món ăn</Title>
              <List
                dataSource={listFood}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta

                      title={`Tên: ${item.food_name}`}
                      description={`Giá: ${item.food_price.toLocaleString("vi-VN") || 0} VNĐ | Số lượng: ${item.quantity || 0}`}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>

        </div>
      </Flex>

    </div>
  )
};

export default BookingDetails;
