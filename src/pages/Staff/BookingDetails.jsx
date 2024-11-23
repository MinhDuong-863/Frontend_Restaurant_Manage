import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Flex, List, message, Row, Typography } from "antd";
import styles from "./BookingDetails.module.scss";
import { addOrderDetail, getListOrder, payment } from "../../services/apiService";
import OrderModal from "../Home/pages/reservatePage/orderModal/orderModal";
const { Title, Text } = Typography;

const BookingDetails = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const [listFood, setListFood] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    console.log("flag", flag);
    const order_detail = getSelectedFoodsMinimal();
    addOrderDetail(item.booking._id, { order_detail }).then((response) => {
      if (response.EC === 0) {
        message.success(response.EM);
        fetchListFood();
        closeOrderModal();
      }
      else {
        message.error(response.EM);
      }
    });
    setSelectedFoods([]);
  }, [flag]);

  const getSelectedFoodsMinimal = () => {
    return selectedFoods.map(food => ({
      food_id: food._id,         // Chỉ lấy `id` từ `_id`
      quantity: food.quantity // Giữ nguyên `quantity`
    }));
  };
  const closeOrderModal = () => setIsOrderModalOpen(false);
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
  const handleAddFood = () => {
    // gọi modal thêm món ăn
    setIsOrderModalOpen(true)

  }
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
          <Button onClick={handleAddFood} className={styles["btn"]}>Thêm món</Button>
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
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={closeOrderModal}
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
            flag={flag}
            setFlag={setFlag}
          />
        </div>
      </Flex>

    </div>
  )
};

export default BookingDetails;
