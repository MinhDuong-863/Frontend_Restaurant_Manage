import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Flex, Form, Input, List, message, Row, Select, Space, Typography } from "antd";
import styles from "./BookingDetails.module.scss";
import { addOrderDetail, getListOrder, payment } from "../../services/apiService";
import OrderModal from "../Home/pages/reservatePage/orderModal/orderModal";
import Promotion from "../Home/pages/account/promotionModal/promotion";
// import InfiniteScroll from "react-infinite-scroller";
const { Title, Text } = Typography;

const BookingDetails = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const [listFood, setListFood] = useState([]);
  const [form] = Form.useForm();
  const [promotion, setPromotion] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [flag, setFlag] = useState(false);
  const [tempPrice, setTempPrice] = useState(0);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const closePromotionModal = () => setIsPromotionModalOpen(false);
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
      label: 'Lưu ý',
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
    if (promotion) {
      // setTotal(total - promotion.discount);
      form.setFieldsValue({ voucher: promotion.code });
    }
  }, [promotion]);
  useEffect(() => {
    setTotalPrice(calculateTotalPrice(listFood));
  }, [listFood]);
  useEffect(() => {
    setTempPrice(totalPrice + (item.booking.table.type === 'VIP' ? 1000000 : 0) - item.booking.deposit);

  }, [totalPrice]);
  useEffect(() => {
    handleTotal();
  }, [tempPrice]);
  useEffect(() => {

  }, [total]);
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
      voucher: promotion?.code, // mã giảm giá
      total // số tiền
    }).then((response) => {
      console.log(response);
      window.open(response.data.DT.payUrl, '_blank');
    })
  }
  const handleOpenModal = () => {
    setIsPromotionModalOpen(true);
  };

  const handleTotal = () => {
    if (!promotion) {
      setTotal(tempPrice);
      return;
    } else {
      if (promotion.condition <= tempPrice) {
        if (promotion.type === 'fixed') {
          setTotal(tempPrice - promotion.discount);
        } else {
          setTotal(tempPrice - (promotion.discount * tempPrice) / 100);
        }
      } else {
        message.error("Đơn hàng không đủ điều kiện để sử dụng mã giảm giá");
      }
    }
  };
  const handleChange = (e) => {
    if (!e.target.value) {
      setPromotion(null);
      setTotal(tempPrice);
    }
  }
  return (
    <div className={styles["page"]}>
      <Flex vertical gap={20}>
        <Text className={styles["title"]} clas level={3}>Chi tiết đặt trước</Text>
        <Descriptions title={<div className={styles["header-1"]}>Thông tin đặt bàn</div>} bordered items={items} />

        <div className={styles["header-1"]}>Gọi món</div>
        <Flex gap={"1rem"}>
          <Button onClick={handleAddFood} type="primary">Thêm món</Button>
          <Button onClick={handlePayment} type="default">Thanh toán</Button>
        </Flex>
        <div>
          <Row>
            <Col span={12}>
              <Title level={4} >Danh sách món ăn</Title>
              <List
                style={{ maxHeight: 400, overflowY: 'auto' }}
                bordered
                dataSource={listFood}
                locale={{ emptyText: <Space size="large"><Text type="secondary"><Flex className="py-5" vertical align="center" justify="center"><InboxOutlined style={{ fontSize: 40 }} /> Không có món ăn</Flex></Text></Space> }}
                renderItem={(item) => (
                  <List.Item>
                    <Card className={styles["card"]}>
                      <Flex align="center">
                        <List.Item.Meta
                          avatar={<img alt="food" src={item.food_image} style={{ width: 100, height: 100 }} />}
                          title={`Tên: ${item.food_name}`}
                          description={`Giá: ${item.food_price.toLocaleString("vi-VN") || 0} VNĐ | Số lượng: ${item.quantity || 0}`}
                        />
                      </Flex>
                    </Card>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={10} offset={1}>
              <Title level={4}>Thành tiền</Title>
              <Form form={form} layout="inline">
                <Form.Item label="Chọn mã giảm giá" name="voucher">
                  <Input onChange={(e) => handleChange(e)} onDoubleClick={handleOpenModal} />
                </Form.Item>
                <Form.Item >
                  <Button type="primary" onClick={handleTotal}>Áp dụng</Button>
                </Form.Item>
              </Form>
              <Descriptions column={1} className="mt-5 ps-4">
                <Descriptions.Item label={<Text style={{ fontWeight: 700 }}>Tiền cọc: </Text>}>{item.booking.deposit.toLocaleString("vi-VN") || 0} VNĐ</Descriptions.Item>
                <Descriptions.Item label={<Text style={{ fontWeight: 700 }}>Tiền bàn: </Text>}>{item.booking.table.type === 'VIP' ? new Number(1000000).toLocaleString('vi-VN') : 0} VNĐ</Descriptions.Item>
                <Descriptions.Item label={<Text style={{ fontWeight: 700 }}>Tiền món ăn: </Text>}>{totalPrice.toLocaleString("vi-VN") || 0} VNĐ</Descriptions.Item>
                {total !== tempPrice && <Descriptions.Item label={<Text style={{ fontWeight: 700 }}>Giảm giá: </Text>}>{promotion?.discount}{promotion?.type === 'fixed' ? "VNĐ" : "%"}</Descriptions.Item>}
                <Descriptions.Item label={<Text style={{ fontWeight: 700 }}>Thành tiền: </Text>}>
                  <Text hidden={total === tempPrice} type="danger" delete>{(totalPrice + (item.booking.table.type === 'VIP' ? 1000000 : 0) - item.booking.deposit).toLocaleString("vi-VN") || 0} VNĐ</Text> &nbsp;&nbsp;&nbsp; <Text >{total.toLocaleString("vi-VN") || 0} VNĐ</Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>

          </Row>
          <Promotion
            isOpen={isPromotionModalOpen}
            onClose={closePromotionModal}
            setFieldValue={setPromotion}
          />
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={closeOrderModal}
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
            flag={flag}
            setFlag={setFlag}
          />
        </div>
      </Flex >

    </div >
  )
};

export default BookingDetails;
