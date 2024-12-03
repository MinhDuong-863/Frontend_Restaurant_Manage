import './UserFooter.scss';

const UserFooter = () => {
    return (
        <footer className="footer-container">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                {/* Contact Section */}
                <div>
                    <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>LIÊN LẠC</h4>
                    <p>(+84) 82 841 1010</p>
                    <p>info@tastycs.vn</p>
                    <p>1 Võ Văn Ngân, phường Linh Chiểu, thành phố Thủ Đức</p>
                </div>

                {/* Links Section */}
                <div>
                    <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>LIÊN KẾT</h4>
                    <p><a href="/menu" style={{ color: "#fff", textDecoration: "underline" }}>MÓN ĂN</a></p>
                    <p><a href="/reservation" style={{ color: "#fff", textDecoration: "underline" }}>ĐẶT BÀN</a></p>
                    <p><a href="/recruitment" style={{ color: "#fff", textDecoration: "underline" }}>TUYỂN DỤNG</a></p>
                </div>

                {/* Opening Hours Section */}
                <div>
                    <h4 style={{ fontSize: "20px", marginBottom: "10px" }}>GIỜ MỞ CỬA</h4>
                    <p>HẰNG NGÀY</p>
                    <p>Mở cửa từ 09:00 đến 22:00</p>
                </div>
            </div>

            {/* Divider and Bottom Section */}
            <div style={{ marginTop: "20px", borderTop: "1px solid #fff", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0 }}>Copyright 2023 Tastycs Concept Kitchen & Bar, all rights reserved</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <a href="#" style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}>Privacy policy</a>
                    <a href="#" style={{ color: "#fff", textDecoration: "none", marginRight: "15px" }}>FAQs</a>
                </div>
            </div>
        </footer>
    );
}

export default UserFooter;
