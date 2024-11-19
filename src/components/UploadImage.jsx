import React, { useState } from "react";
import './UploadImage.scss';
import { Avatar, Progress, message } from "antd";
import { uploadToCloudinary } from "../utils/cloudinary.jsx";
const UploadImage = ({ src, setSrc }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    let [urlImage, setUrlImage] = useState(src);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình   ----> Department này là tạo thư mục trên cloud để biết ảnh ở thư mục nào á
            const url = await uploadToCloudinary(file, "image", (progress) => {
                setUploadProgress(progress);
            });
            setSrc(url); // Lưu URL ảnh sau khi upload
            setUrlImage(url);
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
        }
    };

    return (
        <div >
            <input type="file" id='input-upload' hidden={true} onChange={handleImageChange} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {urlImage && (
                    <div style={{ filter: uploading ? 'blur(4px)' : 'none', opacity: uploading ? 0.5 : 1, transition: 'all 0.3s ease' }}>
                        <Avatar
                            onClick={() => document.getElementById('input-upload').click()}
                            src={urlImage}
                            alt="Uploaded"
                            size={200}
                        />
                    </div>
                )}
                {uploading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                        }}
                    >
                        <Progress percent={uploadProgress} status="active" />
                    </div>
                )}
            </div>

        </div>
    );
}

export default UploadImage;