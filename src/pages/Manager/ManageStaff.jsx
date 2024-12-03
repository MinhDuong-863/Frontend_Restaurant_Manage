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
import './staff.scss';
const ManageStaff = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })

  // Fetch staff data
  const loadStaffData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const params = { page, pageSize }
      const response = await getAllStaffApi(params);
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
      //handle get staff postion not manager and count staff
      let count = 0;
      const filterData = formattedData.filter((staff) => {
        if (staff.position !== 'Manager') {
          count++;
          return staff;
        }
      })
      console.log(filterData)
      setStaffData(filterData);
      setPagination({
        ...pagination,
        currentPage: page,
        pageSize: pageSize,
        total: count || 0,
      });
      setLoading(false);
    } catch (error) {
      message.error('Failed to load staff data');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData(pagination.currentPage, pagination.pageSize);
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
      message.error('Lỗi cập nhật thông tin nhân viên');
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = async (staffId) => {
    try {
      await deleteStaff(staffId);
      message.success('Xóa nhân viên thành công');
      loadStaffData();
    } catch (error) {
      message.error('Đang xảy ra lỗi khi xóa nhân viên');
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
  const handleTableChange = (pagination, filters, sorter) => {
    loadStaffData(pagination.current, pagination.pageSize);
  };
  return (
    <Card
      title="Quản lý nhân viên"
      extra={
        <Button type="primary" className='btn-custome' onClick={openAddModal}>
          Thêm nhân viên mới
        </Button>
      }
    >
      <StaffTable
        data={staffData}
        loading={loading}
        onEdit={openEditModal}
        pagination={pagination}
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