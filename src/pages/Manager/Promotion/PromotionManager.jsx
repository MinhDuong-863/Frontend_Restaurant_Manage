import ".././staff.scss";
import React, { useState, useEffect, useCallback } from 'react';
import { Input, Card, Button, message, Space, Pagination, Spin, Select, Modal, Form, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { getValidPromotion } from "../../../services/userService";
import { formatCurrency, formatDate2 } from "../../../utils/format";
import { PROMOTION_TYPE, STATUS_PROMOTION } from "../../../constant/values";
import { createPromotion, getPromotionById, updatePromotion } from "../../../services/apiService";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrashCanArrowUp } from "@fortawesome/free-solid-svg-icons";
const INITIAL_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0
};
const { TextArea } = Input;
const PromotionManager = () => {
    const [form] = Form.useForm();
    const [vouchers, setvouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(INITIAL_PAGINATION);
    const [searchTerm, setSearchTerm] = useState('');
    const [isShowModal, setIsShowModal] = useState(false);
    const [voucherUpdate, setVoucherUpdate] = useState(null);
    const [promotionType, setPromotionType] = useState("");
    const fetchvouchers = async () => {
        setLoading(true);
        try {
            const { data, total } = await getValidPromotion(pagination.current, pagination.pageSize, searchTerm);
            setvouchers(data || []);
            setPagination(prev => ({
                ...prev,
                total: total || 0
            }));
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải danh sách giảm giá');
            console.error('Error fetching vouchers:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchvouchers();
    }, [pagination.current, pagination.pageSize, searchTerm]);

    const handlePageChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };
    const handleRefresh = () => {
        setSearchTerm('');
        setPromotionType('');
        setPagination(INITIAL_PAGINATION);
        setVoucherUpdate(null);
        setIsShowModal(false);
        fetchvouchers();
    };
    const renderFilters = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'center'
        }}>
            <Space size="middle" style={{ flex: 1 }}>
                <Input
                    placeholder="Tìm kiếm voucher"
                    prefix={<SearchOutlined />}
                    allowClear
                    value={searchTerm}
                    onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase(); // Chuyển thành chữ hoa
                        setSearchTerm(e.target.value); // Gọi hàm xử lý tìm kiếm
                    }}
                    onPressEnter={() => fetchvouchers()}
                    style={{ height: '3em' }}
                />
                {/* <Select
                    showSearch
                    placeholder="Chọn loại món ăn"
                    optionFilterProp="label"
                    value={selectedVoucherType}
                    onChange={handleVoucherTypeChange}
                    options={TYPE_OF_FOOD}
                    style={{ minWidth: '200px', height: '3em' }}
                    allowClear
                /> */}
            </Space>
            <Button
                type="primary"
                className='btn-create'
                icon={<PlusOutlined />}
                onClick={() => setIsShowModal(true)}
                style={{ height: '3em' }}
            >
                Thêm mới
            </Button>
        </div>
    );
    const handleUpdate = async (id) => {
        let response = await getPromotionById(id);
        if (response.EC === 0) {
            setVoucherUpdate({ ...response.DT, startDate: dayjs(response.DT.startDate), endDate: dayjs(response.DT.endDate) });
            setIsShowModal(true);
        }
        else {
            message.error(response.EM || 'Có lỗi xảy ra khi tải voucher');
        }
    }
    const renderVoucherGrid = () => (
        <div className="promotion-content">
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : vouchers.length === 0 ? (
                <p>Không có voucher khả dụng!</p>
            ) : (
                vouchers.map((promotion, index) => (

                    <div key={index} className="list-promotion mt-3">
                        <div className="promotion-item row">
                            <div className="col-3 with-dashed-border d-flex flex-column justify-content-center">
                                <p className={`text-center discount-fix ${promotion.type === "percentage" ? "discount-percentage" : "discount-fixed"}`}>
                                    {promotion.type === "percentage" ? "Giảm tỉ lệ" : "Giảm trực tiếp"}
                                </p>
                                <p
                                    className={`text-center discount-value ${promotion.type === "percentage" ? "discount-percentage" : ""}`}
                                >
                                    {promotion.type === "fixed"
                                        ? `${formatCurrency(promotion.discount)}`
                                        : `${promotion.discount}%`
                                    }
                                </p>
                            </div>
                            <div className="col-8 d-flex flex-column justify-content-center">
                                <p className="discount-code"><strong className="me-2">Mã giảm giá:</strong> {promotion.code}</p>
                                <p className="discount-text"><strong className="me-2">Số lượng: </strong>{promotion.quantity}</p>
                                <p className="discount-text"><strong className="me-2">Ngày bắt đầu: </strong>{formatDate2(promotion.startDate)} - <strong> Ngày kết thúc:</strong> {formatDate2(promotion.endDate)}</p>
                                <p className="discount-text"><strong className="me-2">Mô tả:</strong> {promotion.description} </p>
                                {promotion?.status === "inactive" && <p className="me-2" style={{ color: "red" }}><strong>Không sử dụng</strong> </p>}
                            </div>
                            <div className="col-1 d-flex justify-content-end align-items-end">
                                <FontAwesomeIcon icon={faPenToSquare} size="lg" color="green" style={{ cursor: "pointer" }} onClick={() => handleUpdate(promotion.promotionId)} />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    const renderPagination = () => (
        <div className="d-flex justify-content-center mt-4">
            <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total) => `Tổng ${total} voucher`}
            />
        </div>
    );
    const handleInsertPromotion = () => {
        form.validateFields().then(async (values) => {
            let response;
            if (voucherUpdate) {
                response = await updatePromotion(voucherUpdate._id, values);
            } else {
                response = await createPromotion(values);
            }
            if (response.EC === 0) {
                message.success(response.EM || 'Thành công');
                handleRefresh();
            } else {
                message.error(response.EM || 'Thất bại');
            }
        }).catch((error) => {
            console.error('Validate Failed:', error);
        });
    }
    return (
        <div className="promotion-manager-content">
            <Card
                title="Quản Lý Mã Giảm Giá"
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                    >
                        Làm mới
                    </Button>
                }
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {renderFilters()}
                    <Spin spinning={loading}>
                        {vouchers.length > 0 ? (
                            renderVoucherGrid()
                        ) : (
                            <div className="text-center py-5">
                                Không tìm thấy mã giảm giá nào
                            </div>
                        )}
                    </Spin>

                    {vouchers.length > 0 && renderPagination()}
                </Space>
            </Card>
            <Modal
                title={"Thêm khuyễn mãi mới"}
                name="basic-moadal"
                open={isShowModal}
                onOk={() => {
                    handleInsertPromotion();
                }}
                onCancel={() => {
                    form.resetFields();
                    setIsShowModal(false);
                }}
            >
                <Form
                    form={form}
                    name="basic-form"
                    layout="vertical"
                    initialValues={voucherUpdate || {}}
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                >
                    <Form.Item
                        name={"type"}
                        label="Loại khuyến mãi"
                        rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi!' }]}
                    >
                        <Select
                            showSearch
                            disabled={voucherUpdate}
                            placeholder="Chọn loại khuyến mãi"
                            options={PROMOTION_TYPE}
                            onChange={(value) => setPromotionType(value)}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"discount"}
                        label="Mức giảm giá"
                        rules={[
                            { required: true, message: "Vui lòng nhập giá trị khuyến mãi!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    if (promotionType === PROMOTION_TYPE[0].value && (value < 0 || value > 100)) {
                                        return Promise.reject(
                                            new Error("Giá trị phải nằm trong khoảng từ 0 đến 100!")
                                        );
                                    } else if (value < 0) {
                                        return Promise.reject(
                                            new Error("Giá trị không được nhỏ hơn 0!")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input disabled={voucherUpdate} type="number" placeholder="Vui lòng nhập mức giảm giá" />
                    </Form.Item>
                    <Form.Item
                        name={"startDate"}
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày bắt đầu"
                            format={'DD/MM/YYYY'} style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"endDate"}
                        label="Ngày kết thúc"
                        dependencies={['startDate']}
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const startDate = getFieldValue('startDate');
                                console.log("startDate", startDate);
                                if (!value || !startDate || dayjs(value).isAfter(dayjs(startDate))) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Ngày kết thúc phải sau Ngày bắt đầu!')
                                );
                            },
                        }),
                        ]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày kết thúc"
                            format={'DD/MM/YYYY'} style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="condition"
                        label="Điều kiện áp dụng"
                    >
                        <Input type="number" placeholder="Vui lòng nhập điều kiện áp dụng" min={0} />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Số lượng khuyễn mãi"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng khuyến mãi!' }]}
                    >
                        <Input type="number" placeholder="Vui lòng nhập số lượng khuyến mãi" disabled={voucherUpdate}
                            min={0} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả khuyến mãi"
                    >
                        <TextArea placeholder="Vui lòng nhập mô tả cho khuyến mãi" rows={5} />
                    </Form.Item>
                    {voucherUpdate && <Form.Item
                        name="status"
                        label="Trạng thái"
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={STATUS_PROMOTION}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>}
                </Form>
            </Modal>
        </div >
    );
}

export default PromotionManager;