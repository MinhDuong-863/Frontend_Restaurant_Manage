import { useEffect, useState } from "react";
import { getOrderBookApi, getBookingById, updateBookingApi } from "../../services/apiService";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils/format";
import "./staff.scss"
import { Button, Card, Col, Dropdown, Form, Menu, Row, Space, Table, message, Modal, Select } from "antd";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { STATUS_ORDER, STATUS_PAYMENT } from "../../constant/values";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


let statusOrderArr = [];
for (let i = 1; i < STATUS_ORDER.length; i++) {
    statusOrderArr.push({ value: STATUS_ORDER[i].key, label: STATUS_ORDER[i].label });
}
let statusPaymentArr = [];
for (let i = 1; i < STATUS_PAYMENT.length; i++) {
    statusPaymentArr.push({ value: STATUS_PAYMENT[i].key, label: STATUS_PAYMENT[i].label });
}
const OrderManager = () => {
    let [orders, setOrders] = useState([]);
    let [showModal, setShowModal] = useState(false);
    let [statusPayment, setStatusPayment] = useState("");
    let [loading, setLoading] = useState(false);
    let [statusOrder, setStatusOrder] = useState("");
    let [bookingUpdate, setBookingUpdate] = useState({});
    let [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Số lượng bản ghi trên mỗi trang
        total: 0,    // Tổng số bản ghi (lấy từ API)
    });
    let [form] = Form.useForm();
    let getAllBooking = async () => {
        try {
            setLoading(true);
            let params = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                statusPayment: statusPayment,
                statusOrder: statusOrder,
            };
            let response = await getOrderBookApi(params);
            console.log(response);
            let orderList = response?.DT?.infor || [];
            let formattedData = orderList.map((order) => ({
                id: order.booking?._id,
                customerInfo: {
                    fullName: order?.user?.first_name + " " + order?.user?.last_name,
                    phone: order?.user?.phone_number,
                },
                date: formatDate(order?.booking?.date) + " - " + order?.booking?.time,
                total: order?.booking?.total,
                table: order?.booking?.table?.name + " - " + order?.booking?.table?.type,
                totalFood: order.booking.order_detail.length,
                statusPayment: order.booking.payment_status,
                statusOrder: order.booking.status,
            }));
            setPagination(prevState => ({
                ...prevState,
                total: response?.DT?.total || 0,
            }));
            setOrders(formattedData);
        } catch (error) {
            message.error('Failed to load booking data');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllBooking();
    }, [pagination.current, pagination.pageSize, statusPayment, statusOrder]);
    let handleTableChange = (paginationa) => {
        setPagination({
            ...pagination,
            current: paginationa.current,
            pageSize: paginationa.pageSize,
        });
    };
    let tableColumns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerInfo',
            key: 'customerInfo',
            render: (record) => (
                <div>
                    <div><strong>{record.fullName}</strong></div>
                    <div style={{ color: 'gray', fontSize: '14px' }}>{record.phone}</div>
                </div>
            ),
        },
        {
            title: 'Bàn',
            dataIndex: 'table',
            key: 'table',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Thời gian',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Số món ăn',
            dataIndex: 'totalFood',
            key: 'totalFood',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: (
                <div>
                    Trạng thái{'   '}
                    <Dropdown
                        overlay={
                            <Menu
                                onClick={(e) => setStatusOrder(e.key)}
                                items={STATUS_ORDER.map((item) => ({
                                    key: item.key,
                                    label: item.label,
                                }))}
                            />
                        }
                        trigger={['click']}
                        overlayClassName="dropdownProfile"
                        placement="bottomRight"
                    >
                        <Space>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </Space>
                    </Dropdown>
                </div>),
            dataIndex: 'statusOrder',
            key: 'statusOrder',
            render: (record) => {
                let status = STATUS_ORDER.find(item => item.key === record)
                return (
                    <div>
                        <span style={{ color: status?.color }}>
                            {status?.label || 'Không xác định'}
                        </span>
                    </div>
                );
            },
        },
        {
            title: (
                <div>
                    Thanh toán{'   '}
                    <Dropdown
                        overlay={
                            <Menu
                                onClick={(e) => setStatusPayment(e.key)}
                                items={STATUS_PAYMENT.map((item) => ({
                                    key: item.key,
                                    label: item.label,
                                }))}
                            />
                        }
                        trigger={['click']}
                        overlayClassName="dropdownProfile"
                        placement="bottomRight"
                    >
                        <Space>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </Space>
                    </Dropdown>
                </div>
            ),
            key: 'statusPayment',
            render: (record) => (
                <div>
                    <div>
                        {record?.statusPayment === "paid" && <span style={{ color: 'green' }}>Đã thanh toán</span>}
                        {record?.statusPayment === "refunded" && <span style={{ color: 'red' }}> Hoàn tiền</span>}
                        {record?.statusPayment === "pending" && <span style={{ color: '#FFA500' }}>Chưa thanh toán</span>}
                    </div>
                </div>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (record) => (
                <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<EditOutlined />}
                    style={{ marginRight: 8 }}
                    onClick={() => {
                        handleUpdateBooking(record.id);
                    }}
                >
                </Button>
            ),
        }
    ];
    let handleUpdateBooking = async (id) => {
        let response = await getBookingById(id);
        if (response?.DT[0]?._id) {
            setBookingUpdate(response.DT[0]);
            setShowModal(true);
        } else {
            message.error(response?.EC || "Không tìm thấy bản ghi")
        }
    }
    let handleUpdate = async () => {
        form.validateFields().then(async (values) => {
            console.log(values);
            let response = await updateBookingApi(bookingUpdate._id, { status: values.status, payment_status: values.payment_status });
            if (response.EC === 0) {
                message.success(response?.EM || 'Thành công');
                setShowModal(false);
                getAllBooking();
            } else {
                message.error(response?.EM || 'Thất bại');
            }
        }
        ).catch((error) => {
            message.error('Vui lòng chọn trạng thái');
            console.log(error);
        });
    }
    return (
        <div className="order-manager-content">
            <Row>
                <Col span={24}>
                    <Card
                        title="Danh sách đặt bàn"
                    >
                        <Table
                            columns={tableColumns}
                            dataSource={orders}
                            rowKey="id"
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: true,
                                pageSizeOptions: ['5', '10', '20'],
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
                            }}
                            loading={loading}
                            onChange={handleTableChange}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                title={"Thông tin đặt bàn"}
                name="updateBooking"
                open={showModal}
                onOk={() => {
                    handleUpdate();
                }}
                onCancel={() => {
                    setBookingUpdate(null);
                    setShowModal(false);
                }}
            >
                <Form
                    form={form}
                    name="updateBooking"
                    layout="horizontal"
                    initialValues={{
                        status: bookingUpdate?.status,
                        payment_status: bookingUpdate?.payment_status,
                    }}
                >
                    <Form.Item
                        name="_id"
                        label="Mã đặt bàn"
                    >
                        {bookingUpdate?._id}
                    </Form.Item>
                    <Form.Item
                        name="table"
                        label="Bàn"
                    >
                        {bookingUpdate?.table?.name + " - " + bookingUpdate?.table?.type}
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Ngày đặt"
                    >
                        {formatDate(bookingUpdate?.date)}
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Thời gian"
                    >
                        {bookingUpdate?.time}
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        {bookingUpdate?.note}
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái đặt bàn"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={statusOrderArr} />
                    </Form.Item>
                    <Form.Item
                        name="payment_status"
                        label="Trạng thái thanh toán"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={statusPaymentArr} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default OrderManager