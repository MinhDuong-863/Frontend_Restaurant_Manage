import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import StaffTable from './TableListStaff';
import StaffModal from './StaffModal';
import { 
  getAllStaffApi, 
  deleteStaff, 
  addStaff, 
  updateStaff 
} from '../../services/apiService';

const ManageStaff = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  // Fetch staff data
  const loadStaffData = async () => {
    try {
      setLoading(true);
      const response = await getAllStaffApi();
      const staffList = response?.DT?.staffs || [];
      const formattedData = staffList.map((staff) => ({
        id: staff.staffId,
        name: staff.fullName,
        position: staff.position.charAt(0).toUpperCase() + staff.position.slice(1), 
        contact: staff.phone_number,
        type: staff.type,
        email: staff.email,
        salary: staff.salary,
        cid: staff.cid,
        status: staff.status === 'active' ? 'Active' : 'Inactive',
        avatar: staff.avatar,
      }));
      setStaffData(formattedData);
      setLoading(false);
    } catch (error) {
      message.error('Failed to load staff data');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
  }, []);

  // Handle staff addition
  const handleAddStaff = async (staffInfo) => {
    try {
      await addStaff(staffInfo);
      message.success('Thêm nhân viên mới thành công');
      loadStaffData();
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to add staff');
    }
  };

  // Handle staff update
  const handleUpdateStaff = async (staffId, staffInfo) => {
    try {
      await updateStaff(staffId, staffInfo);
      message.success('Cập nhật thông tin thành công');
      loadStaffData();
      setModalVisible(false);
    } catch (error) {
      message.error('Failed to update staff');
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = async (staffId) => {
    try {
      await deleteStaff(staffId);
      message.success('Staff deleted successfully');
      loadStaffData();
    } catch (error) {
      message.error('Failed to delete staff');
    }
  };

  // Open modal for adding new staff
  const openAddModal = () => {
    setCurrentStaff(null);
    setModalVisible(true);
  };

  // Open modal for editing staff
  const openEditModal = (staff) => {
    setCurrentStaff(staff);
    setModalVisible(true);
  };

  return (
    <Card 
      title="Quản lý nhân viên" 
      extra={
        <Button type="primary" onClick={openAddModal}>
          Thêm nhân viên mới
        </Button>
      }
    >
      <StaffTable 
        data={staffData}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDeleteStaff}
      />

      <StaffModal
        visible={modalVisible}
        staff={currentStaff}
        onCancel={() => setModalVisible(false)}
        onSubmit={currentStaff ? 
          (staffInfo) => handleUpdateStaff(currentStaff.id, staffInfo) : 
          handleAddStaff
        }
      />
    </Card>
  );
};

export default ManageStaff;