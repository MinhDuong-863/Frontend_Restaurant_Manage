import { Button, Card, Col, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Table, Tag, message } from "antd";
import "./staff.scss"
import { createRecruitment, deleteRecruitment, getAllRecruitmentApi, getApplicationApi, getApplicationById, getRecruitmentById, updateApplicationApi, updateRecruitment } from "../../services/apiService";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../utils/format";
import { POSITIONS, REQUIREMENTS, TYPE_OF_RECRUITMENT, STATUS_APPLY } from "../../constant/values";
import dayjs from "dayjs";
import { current } from "@reduxjs/toolkit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Application = (props) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5, // Số lượng bản ghi trên mỗi trang
        total: 0,    // Tổng số bản ghi (lấy từ API)
    });
    const [showModal, setShowModal] = useState(false);
    const [applicationUpdate, setApplicationUpdate] = useState(null);
    const getAllApplication = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                recruitmentId: props.recruimentDetal
            };
            const response = await getApplicationApi(params);
            const applicationList = response?.DT?.applications || [];
            const formattedData = applicationList.map((application) => ({
                id: application.applicationId,
                recruitment_id: application.recruitment_id,
                full_name: application.full_name,
                email: application.email,
                phone_number: application.phone_number,
                cid: application.cid,
                address: application.address,
                dob: formatDate(application.dob),
            }));
            setPagination(prevState => ({
                ...prevState,
                total: response?.DT?.total || 0,
            }));
            setApplications(formattedData);
        } catch (error) {
            message.error('Failed to load application data');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllApplication(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, props.recruimentDetal]);

    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize
        });
    };
    const tableColumns = [
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'CCCD',
            dataIndex: 'cid',
            key: 'cid'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            key: 'actions',
            width: 150,
            render: (text, record) => (
                <div>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        style={{ marginRight: 8 }}
                    >
                    </Button>
                </div>
            ),
        },
    ];
    let onEdit = async (record) => {
        let reponse = await getApplicationById(record.id);
        if (reponse?.DT?._id) {
            setApplicationUpdate(reponse.DT);
            form.setFieldsValue({ status: reponse.DT.status });
            setShowModal(true);
        } else {
            message.error('Không tìm thấy thông tin ứng viên');
            getAllApplication(pagination.current, pagination.pageSize);
        }
    }
    let handleUpdateApplication = async () => {
        form.validateFields().then(async (values) => {
            console.log(values);
            let response = await updateApplicationApi(applicationUpdate._id, { status: values.status });
            if (response.EC === 0) {
                message.success(response?.EM || 'Cập nhật trạng thái ứng viên thành công');
                setShowModal(false);
                getAllApplication(pagination.current, pagination.pageSize);
            } else {
                message.error(response?.EM || 'Cập nhật trạng thái ứng viên thất bại');
            }
        }
        ).catch((error) => {
            message.error('Vui lòng chọn trạng thái');
            console.log(error);
        });
    }
    return (
        <div>
            <Row>
                <Col span={24}>
                    <Card
                        title="Danh sách đơn ứng tuyển"
                        extra={
                            <Button
                                type="primary"
                                className='btn-custome'
                                icon={<FontAwesomeIcon icon={faX} />}
                                onClick={() => {
                                    props.close();
                                }}
                            >
                            </Button>
                        }
                    >
                        <Table
                            columns={tableColumns}
                            dataSource={applications}
                            rowKey="id"
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: true,
                                pageSizeOptions: ['5', '10', '20'],
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} ứng viên`,
                            }}
                            loading={loading}
                            onChange={handleTableChange}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                title={"Thông tin ứng cử viên"}
                open={showModal}
                onOk={() => {
                    handleUpdateApplication();
                }}
                onCancel={() => {
                    setApplicationUpdate(null);
                    setShowModal(false);
                }}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    initialValues={applicationUpdate || {}}
                >
                    <Form.Item
                        name="full_name"
                        label="Họ và tên"
                    >
                        {applicationUpdate?.full_name}
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        {applicationUpdate?.email}
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Số điện thoại"
                    >
                        {applicationUpdate?.phone_number}
                    </Form.Item>
                    <Form.Item
                        name="cid"
                        label="Căn cước công dân"
                    >
                        {applicationUpdate?.cid}
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                    >
                        {applicationUpdate?.address}
                    </Form.Item>
                    <Form.Item
                        name="dob"
                        label="Ngày sinh"
                    >
                        {formatDate(applicationUpdate?.dob)}
                    </Form.Item>
                    <Form.Item
                        name="require"
                        label="Yêu cầu"
                    >
                        {applicationUpdate?.require}
                    </Form.Item>
                    <Form.Item
                        name="about"
                        label="Thông tin thêm"
                    >
                        {applicationUpdate?.about}
                    </Form.Item>

                    <Form.Item
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={STATUS_APPLY} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default Application;