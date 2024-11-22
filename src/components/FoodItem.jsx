import React, { useState } from "react";
import { Card, Row, Col, InputNumber, Button, Form, Flex, Typography } from "antd";

const { Text, Title } = Typography;
const FoodItem = ({ foodName = "Tên món ăn", price = 0, quantity = 0, foodImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDvhVj35wKn7UFUA96YOQD-nZCMsxRKr_Mhw&s" }) => {
    const [form] = Form.useForm();

    const onQuantityChange = (value) => {
        setQuantity(value);
        form.setFieldsValue({ quantity: value });
    };

    const handleFormSubmit = (values) => {
        console.log("Form Values:", values);
        // Gửi dữ liệu đến backend hoặc xử lý logic
    };

    return (
        <Card size="small" style={{ borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            <div>
                <Row align="middle" gutter={[16, 16]} style={{ width: "100%" }}>
                    {/* Hình ảnh món ăn */}
                    <Col span={3}>
                        <img
                            src={foodImage}
                            alt="Food"
                            style={{
                                width: "100%",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />
                    </Col>

                    {/* Thông tin món ăn */}
                    <Col span={12}>
                        <Title level={4}>{foodName}</Title>
                        <Text strong>{price.toLocaleString()}đ</Text>
                    </Col>

                    {/* Input số lượng */}
                    <Col span={6}>

                        <Row justify="end" align="middle">
                            <Flex gap={8}>
                                <Text>Số lượng: {quantity}</Text>
                            </Flex>
                        </Row>

                    </Col>
                </Row>

            </div>
        </Card>
    );
};

export default FoodItem;


// import React from 'react';
// import { Form, Input, Button, Table, Checkbox, InputNumber } from 'antd';

// const FoodOrder = () => {
//     const [form] = Form.useForm();

//     const foodMenu = [
//         { key: '1', name: 'Pizza', price: '200,000' },
//         { key: '2', name: 'Burger', price: '100,000' },
//         { key: '3', name: 'Salad', price: '50,000' },
//     ];

//     const onCheckboxChange = (record, checked) => {
//         const currentItems = form.getFieldValue('items') || [];
//         if (checked) {
//             // Add the item
//             form.setFieldValue('items', [...currentItems, record]);
//         } else {
//             // Remove the item
//             const updatedItems = currentItems.filter((item) => item.key !== record.key);
//             form.setFieldValue('items', updatedItems);
//         }
//     };

//     const columns = [
//         { title: 'Name', dataIndex: 'name', key: 'name' },
//         { title: 'Price', dataIndex: 'price', key: 'price' },
//         {
//             title: 'Select',
//             key: 'select',
//             render: (text, record) => (
//                 <Checkbox
//                     onChange={(e) => onCheckboxChange(record, e.target.checked)}
//                 />
//             ),
//         },
//     ];

//     const onFinish = (values) => {
//         console.log('Selected items:', values.items);
//     };

//     return (
//         <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ items: [] }}>
//             {/* Bảng Thực Đơn */}
//             <Table columns={columns} dataSource={foodMenu} pagination={false} />

//             {/* Danh sách món đã chọn */}
//             <Form.List name="items">
//                 {(fields) => (
//                     <div>
//                         {fields.map(({ key, name, ...restField }) => (
//                             <Form.Item
//                                 key={key}
//                                 {...restField}
//                                 label={`Món ăn ${name + 1}`}
//                                 style={{ marginBottom: 16 }}
//                             >
//                                 <Input.Group compact>
//                                     <Form.Item
//                                         name={[name, 'name']}
//                                         noStyle
//                                     >
//                                         <Input readOnly style={{ width: '60%' }} />
//                                     </Form.Item>
//                                     <Form.Item
//                                         name={[name, 'amount']}
//                                         noStyle
//                                     >
//                                         <InputNumber style={{ width: '20%' }} />
//                                     </Form.Item>
//                                 </Input.Group>
//                             </Form.Item>
//                         ))}
//                     </div>
//                 )}
//             </Form.List>

//             {/* Nút Submit */}
//             <Form.Item>
//                 <Button type="primary" htmlType="submit">
//                     Submit
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default FoodOrder;

