import { useEffect, useState } from "react";
import { getOrderBookApi } from "../../services/apiService";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils/format";
import "./staff.scss"
import { Button, Card, Col, Dropdown, Form, Menu, Row, Space, Table, message } from "antd";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { STATUS_PAYMENT } from "../../constant/values";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [statusPayment, setStatusPayment] = useState("");
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Số lượng bản ghi trên mỗi trang
        total: 0,    // Tổng số bản ghi (lấy từ API)
    });
    const [form] = Form.useForm();
    const getAllBooking = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                status: statusPayment
            };
            const response = await getOrderBookApi(params);
            const orderList = response?.DT?.infor || [];
            const formattedData = orderList.map((order) => ({
                id: order.booking?._id,
                fullName: order?.user?.first_name + " " + order?.user?.last_name,
                phone: order?.user?.phone_number,
                date: formatDate(order?.booking?.date) + " - " + order?.booking?.time,
                total: order?.booking?.total,
                table: order?.booking?.table?.name + " - " + order?.booking?.table?.type,
                totalFood: order.booking.order_detail.length,
                statusPayment: order.booking.payment_status,
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
    }, [pagination.current, pagination.pageSize, statusPayment]);
    const handleTableChange = (paginationa) => {
        console.log(paginationa);
        setPagination({
            ...pagination,
            current: paginationa.current,
            pageSize: paginationa.pageSize,
        });
    };
    const tableColumns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Bàn',
            dataIndex: 'table',
            key: 'table',
            width: 150,
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Thời gian',
            dataIndex: 'date',
            key: 'date',
            width: 150,
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
            key: 'salary',
            width: 150,
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
    ];
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
        </div>
    )
}

export default OrderManager