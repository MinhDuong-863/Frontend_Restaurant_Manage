import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './UserHeader.scss';

const UserHeader = () => {
    const navigate = useNavigate();  // Khai báo useNavigate

    const handleReservationClick = () => {
        localStorage.removeItem('token')? // lấy token trong localStorage
        navigate('/reservation'):  // Điều hướng tới trang /reservation
        navigate('/login'); // Điều hướng tới trang /login
    };

    return (
        <div className="user-header">
            <div className="user-header-content row align-items-center">
                <div className='col-2'>
                    <img src="https://res.cloudinary.com/dup39fo44/image/upload/v1732023125/image/qp96r8yjyefqhm4zah3g.png" alt="Logo"/>
                </div>
                <div className='col-1'></div>
                <div className='col-1'></div>
                <div className='col-1 header-item d-flex justify-content-center'>
                    <NavLink to="/" className="header-link" activeClassName="active">
                        Trang chủ
                    </NavLink>
                </div>
                <div className='col-1 header-item d-flex justify-content-center'>
                    <NavLink to="/menu" className="header-link" activeClassName="active">
                        Thực đơn
                    </NavLink>
                </div>
                <div className='col-1 header-item d-flex justify-content-center' style={{padding: '0'}}>
                    <NavLink to="/recruitment" className="header-link" activeClassName="active">
                        Tuyển dụng
                    </NavLink>
                </div>
                <div className='col-1 header-item d-flex justify-content-center' style={{padding: '0'}}>
                    <NavLink to="/login" className="header-link" activeClassName="active">
                        Đăng nhập
                    </NavLink>
                </div>
                <div className='col-1'></div>
                <div className='col-1'></div>
                <div className='col-2 d-flex justify-content-center align-items-center'>
                    <button className='reservation-button' onClick={handleReservationClick}>ĐẶT BÀN</button> {/* Gọi handleReservationClick */}
                </div>
            </div>
        </div>
    )
};

export default UserHeader;
