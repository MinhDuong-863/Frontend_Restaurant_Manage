import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './UserHeader.scss';
import { message } from 'antd';

const UserHeader = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleReservationClick = () => {
        isLoggedIn ? navigate('/reservation') : navigate('/login');
    };

    const handleAccountClick = () => {
        isLoggedIn ? navigate('/account') : navigate('/login');
    };

    const handleAuthAction = () => {
        if (isLoggedIn) {
            // Logout logic
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            navigate('/');
            message.success('Đăng xuất thành công');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="user-header">
            <div className="user-header-content row align-items-center">
                <div className='col-2'>
                    <img 
                        src="https://res.cloudinary.com/dup39fo44/image/upload/v1732023125/image/qp96r8yjyefqhm4zah3g.png" 
                        alt="Logo"
                    />
                </div>
                <div className='col-1'></div>
                <div className='col-1'></div>
                <div className='col-1 header-item d-flex justify-content-center'>
                    <NavLink to="/" className="header-link" activeClassName="active">
                        Trang chủ
                    </NavLink>
                </div>
                <div className='col-1 header-item d-flex justify-content-center' style={{padding: '0'}}>
                    <NavLink to="/recruitment" className="header-link" activeClassName="active">
                        Tuyển dụng
                    </NavLink>
                </div>
                <div className='col-1 header-item d-flex justify-content-center' style={{padding: '0'}}>
                    <button 
                        onClick={handleAccountClick} 
                        className="button-header-link"
                    >
                        Tài khoản
                    </button>
                </div>
                <div className='col-1 header-item d-flex justify-content-center' style={{padding: '0'}}>
                    <button 
                        onClick={handleAuthAction} 
                        className="button-header-link"
                    >
                        {isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}
                    </button>
                </div>
                <div className='col-1'></div>
                <div className='col-1'></div>
                <div className='col-2 d-flex justify-content-center align-items-center'>
                    <button 
                        className='reservation-button' 
                        onClick={handleReservationClick}
                    >
                        ĐẶT BÀN
                    </button>
                </div>
            </div>
        </div>
    )
};

export default UserHeader;