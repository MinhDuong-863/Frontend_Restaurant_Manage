import { Pagination } from 'antd'
import './Recruitment.scss'
import { useEffect, useState } from 'react'
import { getRecruitments } from "../../../../services/userService.jsx";
import RecruitmentItem from './recruitmentItem/recruitmentItem.jsx';

const RecruitmentPage = () => {
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
    }, [currentPage, pageSize]); 

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
            <div className='recruitment-content mt-3 d-flex flex-wrap' style={{gap: '35px'}}>
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
            </div>
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
    )
}

export default RecruitmentPage