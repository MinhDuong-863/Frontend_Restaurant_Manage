import './Recruitment.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Button } from 'antd';
import ApplyModal from './applyModal';
import { formatCurrency, formatDate } from '../../../../utils/format';

const RecruitmentItem = ({ details }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='recruitment-item mt-3 row'>
                <div className='col-10'>
                    <h2>Vị trí {details.position}</h2>
                    <p><strong className='me-2'>Mức lương:</strong><span className="highlight">{formatCurrency(details.salary)}</span></p>
                    <p><strong className='me-2'>Loại tuyển dụng:</strong> {details.type}</p>
                    <p><strong className='me-2'>Ngày bắt đầu: </strong>{formatDate(details.start_date)} </p>
                    <p><strong className='me-2'>Yêu cầu:</strong> {details.require}</p>
                </div>
                <div className='col-1 d-flex align-items-end' style={{ padding: '0' }}>
                    <button className="btn-detail" onClick={showModal}>
                        Chi tiết
                    </button>
                </div>
                <div className='col-1 d-flex align-items-end' style={{ padding: '0' }}>
                    <button className="btn-apply" onClick={() => setIsApplyModalVisible(true)}>Ứng tuyển</button>
                </div>
            </div>
            {/* Modal */}
            <Modal
                title="Chi tiết tuyển dụng:"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button 
                        className="custom-button"
                        key="close" 
                        onClick={() => {
                            setIsApplyModalVisible(true);
                            handleCancel(); 
                        }}> Ứng tuyển
                    </Button>
                ]}
            >
                <p><strong>Vị trí:</strong> {details.position}</p>
                <p><strong>Mức lương:</strong> {details.salary.toLocaleString()} VND</p>
                <p><strong>Ngày bắt đầu:</strong> {new Date(details.start_date).toLocaleDateString()}</p>
                <p><strong>Địa chỉ:</strong> {details.address}</p>
                <p><strong>Mô tả:</strong> {details.describe}</p>
                <p><strong>Yêu cầu:</strong> {details.require}</p>
                <p><strong>Thông tin thêm:</strong> {details.infomation}</p>
                <p><strong>Loại:</strong> {details.type}</p>
            </Modal>

            <ApplyModal
                isVisible={isApplyModalVisible}
                onClose={() => setIsApplyModalVisible(false)}
                recruitmentId={details.recruimentId}
            />
        </>
    );
};

RecruitmentItem.propTypes = {
    details: PropTypes.object.isRequired,
};

export default RecruitmentItem;
