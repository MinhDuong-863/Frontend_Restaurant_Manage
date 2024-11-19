import './AdminPromotion.scss';

const AdminPromotion = () => {
    return (
        <div className="admin-promotion-container">
            <div className="dashboard-header row gap2">
                <div className="col-3 statistical-item">
                    <div className="row">
                        <div className="col-7">
                            <div className="col-12 blur-text">
                                <p className="subtext">Số thứ tự</p>
                            </div>
                            <div className="col-12 ms-2 inline">
                                <p className="number inline orange number-text">87</p>
                                <p className="subtext inline">/100</p>
                            </div>
                            <div className="col-12 blur-text">
                                <p className="subtext">Ngày 17/11/2024</p>
                            </div>
                        </div>
                        <div className="col-4 orange d-flex justify-content-center align-items-center">
                            <div className="icon blur-orange">
                                <i className="fa-solid fa-user-group"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 statistical-item">
                    <div className="row">
                        <div className="col-7">
                            <div className="col-12 blur-text">
                                <p className="subtext">Số bệnh nhân</p>
                            </div>
                            <div className="col-12 ms-2 blue number-text">
                                <p className="number">387</p>
                            </div>
                            <div className="col-12 blur-text">
                                <p className="subtext">Ngày 17/11/2024</p>
                            </div>
                        </div>
                        <div className="col-4 blue d-flex justify-content-center align-items-center">
                            <div className="icon blur-blue">
                                <i className="fa-solid fa-head-side-mask"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 statistical-item">
                    <div className="row">
                        <div className="col-7">
                            <div className="col-12 blur-text">
                                <p className="subtext">Số lịch hẹn</p>
                            </div>
                            <div className="col-12 ms-2 green number-text">
                                <p className="number">37</p>
                            </div>
                            <div className="col-12 blur-text">
                                <p className="subtext">Ngày 17/11/2024</p>
                            </div>
                        </div>
                        <div className="col-4 green d-flex justify-content-center align-items-center">
                            <div className="icon blur-green">
                                <i className="fa-solid fa-bookmark"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPromotion;