import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  Typography, 
  Badge, 
  message, 
  Flex, 
  Modal, 
  Select, 
  Button,
  Form,
  Card,
  Space,
  Avatar,
  Alert,
  Tooltip
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import './ShiftPage.scss';
import clientApi from "../../../client-api/rest-client-api";
import { useSelector } from "react-redux";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Text, Title } = Typography;
const { Option } = Select;
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
const ShiftManagement = () => {
    const [form] = Form.useForm();
    const [shiftData, setShiftData] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDateShifts, setSelectedDateShifts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 93 });
    const [updateShift, setUpdateShift] = useState(false);

    useEffect(() => {
        fetchShiftData();
        fetchStaffList();
    }, []);

    const fetchShiftData = async () => {
        try {
            const response = await clientApi.service('shift').find({ ...pagination });
            if (response.EC === 0) {
                setShiftData(response.DT.shifts || []);
            }
        } catch (error) {
            message.error('Không thể tải dữ liệu ca làm việc');
        }
    };

    const fetchStaffList = async () => {
        try {
            const response = await clientApi.service('staff').find();
            if (response.EC === 0) {
                setStaffList(response.DT.staffs || []);
            }
        } catch (error) {
            message.error('Không thể tải danh sách nhân viên');
        }
    };

    // Get shifts for calendar display
    const getListData = (value) => {
        const dateStr = dayjs(value).format("YYYY-MM-DD");
        const events = shiftData.filter(item => 
            dayjs(item.date).format("YYYY-MM-DD") === dateStr
        );

        // Group shifts by shift_number
        const shiftsGrouped = events.reduce((acc, curr) => {
            const key = curr.shift_number;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
        }, {});

        return Object.entries(shiftsGrouped).map(([shift, staffs]) => ({
            type: 'success',
            content: `Ca ${shift} (${staffs.length} nhân viên)`
        }));
    };

    // Calendar cell renderer
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => (
                    <div key={index}>
                        <Badge status={item.type} text={item.content} />
                    </div>
                ))}
            </ul>
        );
    };

    // Handle date selection
    const handleSelect = (date) => {
        setSelectedDate(date);
        const dateStr = date.format("YYYY-MM-DD");
        const shifts = shiftData.filter(item =>
            dayjs(item.date).format("YYYY-MM-DD") === dateStr
        );
        setSelectedDateShifts(shifts);
        setIsModalOpen(true);
        form.resetFields();
    };

    // Handle shift creation
    const handleCreateShift = async (values) => {
        try {
            setLoading(true);
            const shiftData = {
                date: selectedDate.format('YYYY-MM-DD[T]00:00:00.000+07:00'),
                shift_number: values.shift_number,
                list_staff: values.list_staff
            };

            const response = await clientApi.service('shift').create(shiftData);
            if (response.EC === 0) {
                message.success('Tạo ca làm việc thành công');
                fetchShiftData();
                setIsModalOpen(false);
            } else {
                message.error(response.EM || 'Không thể tạo ca làm việc');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo ca làm việc');
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateShift = async (values) => {
      try{
          setLoading(true);
          const updateData = {
            date: selectedDate.format('YYYY-MM-DD[T]00:00:00.000+07:00'),
            shift_number: values.shift_number,
            list_staff: values.list_staff
        };

        const response = await clientApi.service('shift').update(editingShift._id, updateData);
        if (response.EC === 0) {
            message.success('Cập nhật ca làm việc thành công');
            fetchShiftData();
            setEditingShift(null);
            form.resetFields();
        } else {
            message.error(response.EM || 'Không thể cập nhật ca làm việc');
        }
      }catch(error){
        message.error('Có lỗi xảy ra khi cập nhật ca làm việc');
      }finally{
        setLoading(false);
      }
    }
    //handle delete shift
    const handleDeleteShift = async (shiftId) => {
      try {
        const response = await clientApi.service('shift').delete(shiftId);
        if (response.EC === 0) {
            message.success('Xóa ca làm việc thành công');
            fetchShiftData();
            // Refresh the selected date shifts
            const updatedShifts = selectedDateShifts.filter(shift => shift._id !== shiftId);
            setSelectedDateShifts(updatedShifts);
        } else {
            message.error(response.EM || 'Không thể xóa ca làm việc');
        }
      }catch(error){
          message.error('Có lỗi xảy ra khi xóa ca làm việc');
      }finally{
          setLoading(false);
      }
    };
    const handleEditShift = (shift) => {
      setEditingShift(shift);
      form.setFieldsValue({
          shift_number: shift.shift_number,
          list_staff: shift.list_staff.map(staff => staff.staffId)
      });
    };
    // Group shifts by shift number
    const getShiftsByNumber = (shifts) => {
        return shifts.reduce((acc, curr) => {
            const key = curr.shift_number;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(curr);
            return acc;
        }, {});
    };

    // Check if all shifts are assigned for the day
    const getAvailableShifts = (existingShifts) => {
        const existingShiftNumbers = [...new Set(existingShifts.map(shift => shift.shift_number))];
        const allShiftNumbers = [1, 2, 3];
        return allShiftNumbers.filter(num => !existingShiftNumbers.includes(num));
    };

    return (
      <div style={{ padding: 10 }}>
        <Flex justify="space-between" align="center" className="mb-4">
          <Text className="title" level={3} style={{ fontSize: '24px' }}>Quản lý ca làm việc</Text>
        </Flex>

        <Flex justify="center">
          <Calendar 
            onSelect={handleSelect} 
            style={{ width: "90%" }} 
            cellRender={dateCellRender}
          />
        </Flex>

        <Modal
          title={<Title level={4} style={{ fontSize: '20px' }}>Phân ca làm việc - {selectedDate?.format('DD/MM/YYYY')}</Title>}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered={true}
          width={800}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {selectedDateShifts.length > 0 && (
              <div className="shift-page">
              <Card title="Ca làm việc hiện tại" size="small">
                {Object.entries(getShiftsByNumber(selectedDateShifts)).map(([shiftNumber, staffs]) => (
                  <Card 
                    key={shiftNumber} 
                    className="shift-card"
                    type="inner" 
                    title={`Ca ${shiftNumber}`}
                  >
                    <div className="staff-list-container">
                      {staffs.map((staff) => (
                        <Card 
                          key={staff.staffId} 
                          className="staff-card"
                          size="small"
                        >
                          <div className="staff-info">
                            <Avatar src={staff.avatar} />
                            <div className="text-content">
                              <Tooltip title={staff.fullName} placement="topLeft">
                                <div className="staff-name">
                                  {truncateText(staff.fullName, 15)}
                                </div>
                              </Tooltip>
                              <Tooltip title={staff.email} placement="topLeft">
                                <Text type="secondary" className="staff-email">
                                  {truncateText(staff.email, 20)}
                                </Text>
                              </Tooltip>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Card>
                ))}
              </Card>
            </div>
            )}

            {/* Form to create new shift - only shown if there are available shifts */}
            {getAvailableShifts(selectedDateShifts).length > 0 ? (
              <Card title="Tạo ca làm việc mới">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCreateShift}
                >
                  <Form.Item
                    name="shift_number"
                    label="Ca làm việc"
                    rules={[{ required: true, message: 'Vui lòng chọn ca!' }]}
                  >
                    <Select>
                      {getAvailableShifts(selectedDateShifts).map(shiftNumber => (
                        <Option key={shiftNumber} value={shiftNumber}>
                          Ca {shiftNumber} ({shiftNumber === 1 ? '6:00 - 14:00' : 
                                   shiftNumber === 2 ? '14:00 - 22:00' : 
                                   '22:00 - 6:00'})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="list_staff"
                    label="Chọn nhân viên"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một nhân viên!' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn nhân viên"
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                    >
                      {staffList.map(staff => (
                        <Option key={staff.staffId} value={staff.staffId}>
                          {staff.fullName} - {staff.position}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      style={{ width: '100%' }}
                    >
                      Tạo ca làm việc
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ) : (
              selectedDateShifts.length > 0 && (
                <Alert
                  message="Tất cả ca làm việc đã được phân công"
                  type="info"
                  showIcon
                />
              )
            )}
          </Space>
        </Modal>
      </div>
    );
};

export default ShiftManagement;