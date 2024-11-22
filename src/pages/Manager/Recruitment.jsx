import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Table, message } from "antd";
import "./staff.scss"
import { createRecruitment, deleteRecruitment, getAllRecruitmentApi, getRecruitmentById, updateRecruitment } from "../../services/apiService";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../utils/format";
import { POSITIONS, REQUIREMENTS, TYPE_OF_RECRUITMENT } from "../../constant/values";
import dayjs from "dayjs";
import Application from "./Application";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Recruitment = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recruitmentUpdate, setRecruitmentUpdate] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Số lượng bản ghi trên mỗi trang
        total: 0,    // Tổng số bản ghi (lấy từ API)
    });
    const [recruimentDetal, setRecruitmentDetail] = useState("");
    const [form] = Form.useForm();
    const getAllRecruitment = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.current,
                pageSize: pagination.pageSize
            };
            const response = await getAllRecruitmentApi(params);
            const recruimentList = response?.DT?.recruiments || [];
            const formattedData = recruimentList.map((recruitment) => ({
                id: recruitment.recruimentId,
                position: recruitment.position,
                salary: formatCurrency(recruitment.salary),
                start_date: formatDate(recruitment.start_date || new Date()),
                address: recruitment.address,
                describe: recruitment.describe,
                require: recruitment.require,
                infomation: recruitment.infomation,
                type: recruitment.type,
            }));
            setPagination(prevState => ({
                ...prevState,
                current: response?.DT?.page,
                total: response?.DT?.total || 0,
                pageSize: response?.DT?.limit || 10,
            }));
            setRecruitments(formattedData);
        } catch (error) {
            message.error('Failed to load ingredient data');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllRecruitment(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);
    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };
    const handleDeleteRecruitment = async (id) => {
        try {
            await deleteRecruitment(id);
            message.success('Xóa tuyển dụng thành công');
            getAllRecruitment(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Đang xảy ra lỗi khi xóa tuyển dụng');
        }
    }
    const handleUpdateRecruitment = async (id) => {
        let response = await getRecruitmentById(id);
        if (response?.DT?.length > 0) {
            setRecruitmentUpdate({ ...response.DT[0], id: id, start_date: dayjs(dayjs(response.DT[0]?.start_date).format('DD/MM/YYYY'), "DD/MM/YYYY") });
            setShowModal(true);
        } else {
            message.error('Không tìm thấy tuyển dụng');
            getAllRecruitment(pagination.current, pagination.pageSize);
        }
    }
    const tableColumns = [
        {
            title: 'Vị trí',
            dataIndex: 'position',
            key: 'position',
            width: 150,
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            key: 'salary',
            width: 150,
        },
        {
            title: 'Loại tuyển dụng',
            key: 'type',
            render: (record) => (
                <div>
                    <div>
                        <span style={{ color: record.type !== "fulltime" ? 'red' : 'green' }}>
                            {record.type}
                        </span>
                    </div>
                </div>
            ),
            width: 120,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            width: 120,
        },
        {
            key: 'actions',
            width: 150,
            render: (record) => (
                <div>
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<EditOutlined />}
                        style={{ marginRight: 8 }}
                        onClick={() => {
                            handleUpdateRecruitment(record.id);
                        }}
                    >
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        style={{ marginRight: 8 }}
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            handleDeleteRecruitment(record.id);
                        }}
                    >
                    </Button>
                    <Button
                        color="green"
                        type="default"
                        size="small"
                        style={{ marginRight: 8 }}
                        icon={<FontAwesomeIcon icon={faCircleInfo} color="green" />}
                        onClick={() => {
                            setRecruitmentDetail(record.id);
                        }}
                    >
                    </Button>
                </div>
            )
        }
    ];
    const handleInsertRecruitment = () => {
        form
            .validateFields()
            .then(async (values) => {
                try {
                    let response;
                    if (recruitmentUpdate) {
                        response = await updateRecruitment(recruitmentUpdate.id, values);
                    } else {
                        response = await createRecruitment(values);
                    }
                    if (response?.DT?._id) {
                        message.success(response?.EM || "Thành công");
                        form.resetFields();
                        setRecruitmentUpdate(null);
                        setShowModal(false);
                        getAllRecruitment(pagination.current, pagination.pageSize);
                    } else {
                        message.error(response?.EM || "Thất bại");
                    }
                } catch (error) {
                    message.error('Đang xảy ra lỗi');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    return (
        <div className="recruitment-content">
            <Row>
                <Col span={24}>
                    <Card
                        title="Danh sách tuyển dụng"
                        extra={
                            <Button
                                type="primary"
                                className='btn-custome'
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setRecruitmentUpdate(null);
                                    form.resetFields();
                                    setShowModal(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        }
                    >
                        <Table
                            columns={tableColumns}
                            dataSource={recruitments}
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
            {recruimentDetal && <Application
                recruimentDetal={recruimentDetal}
                close={() => {
                    setRecruitmentDetail(null);
                }}
            />}
            <Modal
                title={"Thêm mới tuyển dụng"}
                open={showModal}
                onOk={() => {
                    handleInsertRecruitment();
                }}
                onCancel={() => {
                    setRecruitmentUpdate(null);
                    form.resetFields();
                    setShowModal(false);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={recruitmentUpdate || {}}
                >
                    <Form.Item
                        name="position"
                        label="Vị trí tuyển dụng"
                        rules={[{ required: true, message: 'Vui lòng chọn vị trí tuyển dụng!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn vị trí"
                            options={POSITIONS}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="salary"
                        label="Mức lương"
                        rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}
                    >
                        <Input type="number" min={0} placeholder="Vui lòng nhập mức lương" />
                    </Form.Item>

                    <Form.Item
                        name="start_date"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày"
                            format={'DD/MM/YYYY'} style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ tuyển dụng!' }]}
                    >
                        <Input placeholder="Vui lòng nhập địa chỉ tuyển dụng" />
                    </Form.Item>
                    <Form.Item
                        name="require"
                        label="Yêu cầu công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc!' }]}
                    >
                        <Select placeholder="Vui lòng nhập yêu cầu công việc" style={{ width: '100%' }}
                            options={REQUIREMENTS} />
                    </Form.Item>
                    <Form.Item
                        name="infomation"
                        label="Thông tin thêm"
                        rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                    >
                        <Input placeholder="Vui lòng nhập thông tin" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại tuyển dụng"
                        rules={[{ required: true, message: 'Vui lòng chọn loại tuyển dụng!' }]}
                    >
                        <Select
                            placeholder="Chọn loại tuyển dụng"
                            options={TYPE_OF_RECRUITMENT}
                            style={{ width: '100%', }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="describe"
                        label="Mô tả công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc!' }]}
                    >
                        <Input.TextArea placeholder="Vui lòng nhập mô tả công việc" rows={5} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default Recruitment;