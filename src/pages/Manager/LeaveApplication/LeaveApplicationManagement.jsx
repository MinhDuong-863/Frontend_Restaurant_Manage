import { FaWpforms } from "react-icons/fa6";
import React, { useState, useEffect } from 'react';
import { formatDate } from "../../../utils/format";
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Typography,
  Badge,
  Tooltip,
  message
} from 'antd';
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './LeaveManagement.scss';
import clientApi from "../../../client-api/rest-client-api";
import { format } from "crypto-js";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const LeaveManagement = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const formatDateForAPI = (date) => {
    if (!date) return moment().format('DD/MM/YYYY');
    return moment(date).isValid() ? moment(date).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY');
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = moment(dateString);
    return date.isValid() ? date.format('YYYY-MM-DD') : '';
  };
  const fetchLeaveRequests = async (date1=currentDate, status, page=1, limit=10) => {
    try{
      const date = formatDateForAPI(date1);
      const response=await clientApi.service('leave-applications').find({ date, status, page, limit });
      if(response.EC===0){
        const formattedData = response.DT.data.map(item => ({
          id: item._id,
          employeeName: `${item.staff_info.user_info.full_name}`,
          department: item.staff_info.position,
          startDate: formatDate(item.start_date),
          endDate: formatDate(item.end_date),
          reason: item.reason,
          status: item.status
        }));
        setLeaveRequests(formattedData);
        setPagination({
          current: response.DT.pagination.currentPage,
          pageSize: response.DT.pagination.limit,
          total: response.DT.pagination.totalDocuments
        });
      }else{
        throw new Error(response.EM||'Không lấy được danh sách đơn xin nghỉ phép');
      }
    }catch(error){
      message.error('Có lỗi xảy ra khi tải danh sách đơn xin nghỉ phép');
    }finally{
      setLoading(false);
    }
  }  

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleTableChange = (pagination) => {
    fetchLeaveRequests(currentDate, pagination.current, pagination.pageSize);
  };
  const updateStatusLeaveRequest = async (id, status) => {
    try{
      setLoading(true);
      const response = await clientApi.service('leave-applications').put(id, { status });
      if(response.EC===0){
        message.success('Cập nhật trạng thái đơn xin nghỉ phép thành công');
        fetchLeaveRequests();
      }else{
        throw new Error(response.EM||'Có lỗi xảy ra khi cập nhật trạng thái đơn xin nghỉ phép');
      }
    }catch(error){
      message.error('Có lỗi xảy ra khi cập nhật trạng thái đơn xin nghỉ phép');
    }finally{
      setLoading(false);
    }
  }
  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text, record) => (
        <div className="employee-info">
          <UserOutlined className="employee-icon" />
          <div>
            <div className="employee-name">{text}</div>
            <div className="employee-department">
              {(() => {
                switch (record.department) {
                  case 'manager':
                    return 'Quản lý';
                  case 'waiter':
                    return 'Nhân viên';
                  default:
                    return 'Không xác định';
                }
              })()}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian nghỉ',
      dataIndex: 'startDate',
      key: 'dateRange',
      render: (_, record) => (
        <Tooltip title={`${record.startDate} đến ${record.endDate}`}>
          <div className="date-range">
            <CalendarOutlined className="date-icon" />
            <span>{record.startDate} - {record.endDate}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => (
        <Tooltip title={text}>
          <div className="reason-text">
            <FileTextOutlined className="reason-icon" />
            <span>{text}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        let text = 'Chưa xử lý';
        
        switch (status) {
          case 'approved':
            color = 'success';
            text = 'Đã duyệt';
            break;
          case 'rejected':
            color = 'error';
            text = 'Từ chối';
            break;
          case 'pending':
            color = 'processing';
            text = 'Đang chờ';
            break;
          default:
            break;
        }
        
        return <Badge status={color} text={text} />;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className="action-buttons">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                className="approve-button"
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
                className="reject-button"
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleApprove = (id) => {
    Modal.confirm({
      title: 'Xác nhận duyệt đơn',
      content: 'Bạn có chắc chắn muốn duyệt đơn này?',
      okText: 'Duyệt',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        // API call để duyệt đơn
        updateStatusLeaveRequest(id, 'approved');
      }
    });
  };

  const handleReject = (id) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: 'Bạn có chắc chắn muốn từ chối đơn này?',
      okText: 'Từ chối',
      cancelText: 'Hủy',
      centered: true,
      onOk: () => {
        // API call để từ chối đơn
        updateStatusLeaveRequest(id, 'rejected');
      }
    });
  };

  const onFinish = (values) => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <div className="leave-management">
      <Card className="leave-card">
        <div className="leave-header">
          <Title level={3}>Quản lý đơn xin nghỉ phép</Title>
        </div>

        <Table
          columns={columns}
          dataSource={leaveRequests}
          loading={loading}
          rowKey="id"
          className="leave-table"
        />

        <Modal
          title="Tạo đơn xin nghỉ phép"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          className="leave-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="dateRange"
              label="Thời gian nghỉ"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian nghỉ' }]}
            >
              <RangePicker className="date-picker" />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Lý do nghỉ phép"
              rules={[{ required: true, message: 'Vui lòng nhập lý do nghỉ phép' }]}
            >
              <TextArea rows={4} placeholder="Nhập lý do nghỉ phép" />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button onClick={() => setVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  Gửi đơn
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default LeaveManagement;