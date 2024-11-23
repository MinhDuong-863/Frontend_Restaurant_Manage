import { Pagination, Select } from 'antd'
import './Recruitment.scss'
import RecruitmentItem from './recruitmentItem'
import { POSITIONS, TYPE_OF_RECRUITMENT } from '../../../../constant/values'
import { useEffect, useState } from 'react'
import { getRecruitments } from "../../../../services/userService.jsx";

const RecruitmentPage = () => {

    const [selectedType, setSelectedType] = useState(null)
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [loading, setLoading] = useState(false);
    const [recruitments, setRecruitments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [total, setTotal] = useState(0);

    const fetchRecruitments = async () => {
        try {
            setLoading(true);
            const { data, totalItem } = await getRecruitments(currentPage, pageSize, '');
            setRecruitments(data);
            setTotal(totalItem);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recruitments:', error);
        }
    };

    useEffect(() => {
        fetchRecruitments();
    }, [selectedType, selectedPosition, currentPage, pageSize]);  // Theo dõi sự thay đổi của currentPage và pageSize

    // const onTypeChange = (value) => {
    //     setSelectedType(value)
    // }

    // const onPositionChange = (value) => {
    //     setSelectedPosition(value)
    // }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);  
        setPageSize(pageSize);  
    };

    return (
        <div className="recruitment-page-container">
            <div className='recruitment-page-title row'>
                <h1>Danh sách tuyển dụng</h1>
                <p style={{textAlign: 'justify'}}>
                    Hãy gia nhập đội ngũ của nhà hàng chúng tôi, nơi tinh hoa ẩm thực và dịch vụ đẳng cấp hòa quyện, để cùng tạo nên những trải nghiệm tuyệt vời cho thực khách!    
                </p>
            </div>
                {/* <div className='recruitment-action row'>
                    <div className='col-2'>
                        <Select
                            showSearch
                            placeholder="Chọn vị trí"
                            optionFilterProp="label"
                            onChange={onPositionChange}
                            value={selectedPosition}
                            options={POSITIONS}
                            style={{width: '100%', height: '3em'}}
                        />
                    </div>
                    <div className='col-3'>
                        <Select
                            showSearch
                            placeholder="Chọn loại công việc"
                            optionFilterProp="label"
                            onChange={onTypeChange}
                            value={selectedType}
                            options={TYPE_OF_RECRUITMENT}
                            style={{width: '100%', height: '3em'}}
                        />
                    </div>
                </div> */}
            <div className='recruitment-content mt-3 row'>
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    recruitments.map((item) => (
                        <RecruitmentItem
                            key={item.recruimentId}
                            details={item}
                        />
                    ))
                )}
                <div className='row mt-3'>
                    <Pagination
                        align="center"
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                    />
                </div> 
            </div>
        </div>
    )
}

export default RecruitmentPage