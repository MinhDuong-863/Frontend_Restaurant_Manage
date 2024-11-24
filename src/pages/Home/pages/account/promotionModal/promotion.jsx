import { Modal, Pagination } from "antd"
import PropTypes from 'prop-types';
import './Promotion.scss'
import { useEffect, useState } from "react";
import { getValidPromotion } from "../../../../../services/userService";
import { formatCurrency, formatDate2 } from "../../../../../utils/format";

const Promotion = ({ isOpen, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [total, setTotal] = useState(0);
    const [promotions, setPromotions] = useState([]);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        if (isOpen) {
            fetchPromotions();
        }
    }, [currentPage, pageSize, search, isOpen]);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const { data, total } = await getValidPromotion(currentPage, pageSize, search);
            setPromotions(data);
            setTotal(total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching foods:', error);
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title="Danh sách khuyến mãi"
                closeIcon={null}
                open={isOpen}
                onCancel={onClose}
                width={800}
                footer={
                    <button
                        key="close"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Đóng
                    </button>}
                className="promotion-modal"
            >
                <div className="promotion-content">
                    <div className="promotion-action row">
                        <div className="col-6">
                            <input type="text"
                                placeholder="Tìm mã khuyến mãi..."
                                onChange={(e) => {
                                    e.target.value = e.target.value.toUpperCase(); // Chuyển thành chữ hoa
                                    onSearchChange(e); // Gọi hàm xử lý tìm kiếm
                                }} />
                        </div>
                    </div>
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : promotions.length === 0 ? (
                        <p>Không có voucher khả dụng!</p>
                    ) : (
                        promotions.map((promotion) => (
                            <>
                                <div className="list-promotion mt-3">
                                    <div className="promotion-item row">
                                        <div className="col-3 with-dashed-border d-flex flex-column justify-content-center">
                                            <p className={`text-center discount-fix ${promotion.type === "percentage" ? "discount-percentage" : "discount-fixed"}`}>
                                                {promotion.type === "percentage" ? "Giảm thỉ lệ" : "Giảm trực tiếp"}
                                            </p>
                                            <p
                                                className={`text-center discount-value ${promotion.type === "percentage" ? "discount-percentage" : ""}`}
                                            >
                                                {promotion.type === "fixed"
                                                    ? `${formatCurrency(promotion.discount)}`
                                                    : `${promotion.discount}%`
                                                }
                                            </p>
                                        </div>
                                        <div className="col-9 d-flex flex-column justify-content-center">
                                            <p className="discount-code"><strong className="me-2">Mã giảm giá:</strong> {promotion.code}</p>
                                            <p className="discount-text"><strong className="me-2">Số lượng: </strong>{promotion.quantity}</p>
                                            <p className="discount-text"><strong className="me-2">Ngày bắt đầu: </strong>{formatDate2(promotion.startDate)} - <strong> Ngày kết thúc:</strong> {formatDate2(promotion.endDate)}</p>
                                            <p className="discount-text"><strong className="me-2">Mô tả:</strong> {promotion.description} </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))
                    )}
                    <div className="row mt-3">
                        <Pagination
                            align="center"
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}
Promotion.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Promotion