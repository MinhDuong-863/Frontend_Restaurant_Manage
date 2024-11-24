import { Button, Flex, Form, Input, List, message, Typography, Pagination, Spin, Divider, Space, Card } from "antd";
import { InboxOutlined, SearchOutlined } from "@ant-design/icons";
import { searchBooking, serveBooking } from "../../services/apiService";
import React, { useEffect, useState } from "react";
import styles from "./BookingPage.module.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Text } = Typography;
const BookingPage = () => {
    const staffId = useSelector(state => state.staff._id)
    const [ListBooking, setListBooking] = useState([])
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const search = async (values) => {
        searchBooking(values).then((res) => {
            if (res.EC === 0) {
                message.success(res.EM)
                setListBooking(res.DT.infor)
                setTotal(res.DT.total)
            }
            else {
                message.error(res.EM)
            }
        })
    }
    const onSubmit = (values) => {
        search({ ...values, page: currentPage, limit: pageSize })
    }

    useEffect(() => {
        fetchData(1, pageSize)
    }, [])

    const fetchData = async (page, limit) => {
        setLoading(true);
        try {
            // Gọi API để lấy dữ liệu
            search({ ...form.getFieldValue(), page, limit })
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchData(page, pageSize);
    };
    const handleServe = (item) => {

        serveBooking(item.booking._id, { list_staff: [staffId] }).then((res) => {
            if (res.EC === 0) {
                navigate("/staff/booking/details", { state: { item } })
            } else {
                message.error(res.EM)
            }
        })
    }
    const checkPhone = (e) => {
        if (e.target.value.length === 0) {
            fetchData(1, pageSize)
        }
    }
    return (
        <Flex vertical >
            <Flex justify="space-between" align="center">
                <Text className={styles["title"]}>Danh sách đặt trước</Text>
                <Form form={form} size="large" onFinish={onSubmit} layout="inline">
                    <Form.Item name="phone_number">
                        <Input onChange={checkPhone} placeholder="Nhập số điện thoại!" />
                    </Form.Item>
                    <Form.Item>
                        <Button className={styles["btn-find"]} htmlType=" submit"> <SearchOutlined />Tìm kiếm</Button>
                    </Form.Item>
                </Form>
            </Flex >
            <div>
                {loading ? (
                    <Spin tip="Loading..." />
                ) : (
                    <List
                        locale={{ emptyText: <Space size="large"><Text type="secondary"><Flex vertical align="center" justify="center"><InboxOutlined style={{ fontSize: 40 }} /> Không có đặt trước hôm nay</Flex></Text></Space> }}
                        className={styles["list"]}
                        dataSource={ListBooking}
                        footer={<div>Tổng cộng : {total}</div>}
                        // bordered
                        renderItem={(item) => (
                            <List.Item key={item?.booking?._id}>
                                <Card className={styles["card"]} size="default">
                                    <Flex align="center">
                                        <List.Item.Meta
                                            title={<>{item?.booking?.time}
                                                <Divider type="vertical" />
                                                {new Date(item.booking.date).toLocaleDateString("vi-VN")}</>}
                                            description={<>
                                                {item?.booking?.table?.name}
                                                <Divider type="vertical" />
                                                {item?.booking?.table?.type}
                                                <Divider type="vertical" />
                                                {item?.booking?.note}
                                            </>}
                                        />
                                        <Button size="large" onClick={() => handleServe(item)}>Phục vụ</Button>
                                    </Flex>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
                <Pagination
                    align="end"
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                    onShowSizeChange={handlePageChange}
                    style={{ marginTop: "20px", textAlign: "center" }}
                />
            </div>
        </Flex >
    );
}
export default BookingPage;