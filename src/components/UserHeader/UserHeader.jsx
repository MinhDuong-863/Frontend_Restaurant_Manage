import './UserHeader.scss';

const UserHeader = () => {
    return (
        <div className="user-header">
            <div className="user-header-content row align-items-center">
                <div className='col-2'>
                    <img src="https://res.cloudinary.com/dup39fo44/image/upload/v1732023125/image/qp96r8yjyefqhm4zah3g.png"/>
                </div>
                <div className='col-1'></div>
                <div className='col-1 header-item d-flex justify-content-center'>Trang chủ</div>
                <div className='col-1 header-item d-flex justify-content-center'>Chúng tôi</div>
                <div className='col-1 header-item d-flex justify-content-center'>Thực đơn</div>
                <div className='col-1 header-item d-flex justify-content-center'>Liên lạc</div>
                <div className='col-1 header-item d-flex justify-content-center' style={{padding: '0'}}>Tuyển dụng</div>
                <div className='col-1 header-item d-flex justify-content-center'>Đăng nhập</div>
                <div className='col-1'></div>
                <div className='col-2 d-flex justify-content-center align-items-center'>
                    <button className='reservation-button'>ĐẶT BÀN</button>
                </div>
            </div>
        </div>
    )
}

export default UserHeader;