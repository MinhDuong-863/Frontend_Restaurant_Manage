import './Recruitment.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Button } from 'antd';
import ApplyModal from '../components/applyModal';

const RecruitmentItem = ({ title, content, details }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);

    const handleApplySubmit = (applyData) => {
        console.log("Dữ liệu ứng tuyển:", applyData);
    }

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
            <div className='recruitment-item row'>
                <div className='col-10'>
                    <h2>{title}</h2>
                    <p>Mức lương: <span className="highlight">3.000.000 vnd</span></p>
                    <p>Loại tuyển dụng: Toàn thời gian (full-time)</p>
                    <p>Ngày bắt đầu: 20/10/2024</p>
                    <p>Yêu cầu: {content}</p>
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
                onSubmit={handleApplySubmit}
                recruitmentId={details.recruimentId}
            />
        </>
    );
};

RecruitmentItem.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    details: PropTypes.shape({
        position: PropTypes.string.isRequired,
        salary: PropTypes.number.isRequired,
        start_date: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        describe: PropTypes.string.isRequired,
        require: PropTypes.string.isRequired,
        infomation: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        recruimentId: PropTypes.string.isRequired,
    }).isRequired,
};

export default RecruitmentItem;
