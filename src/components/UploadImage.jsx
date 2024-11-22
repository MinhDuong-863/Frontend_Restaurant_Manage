import React, { useState } from "react";
import styles from './UploadImage.module.scss';
import { Avatar, Progress, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
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
            <div className={styles["container"]}>
                {urlImage && (
                    <div style={{ filter: uploading ? 'blur(4px)' : 'none', opacity: uploading ? 0.5 : 1, transition: 'all 0.3s ease' }}>
                        <Avatar className={styles["avatar-upload"]}
                            icon={<UserOutlined />}
                            onClick={() => document.getElementById('input-upload').click()}
                            src={urlImage}
                            alt="Uploaded"
                            size={200}
                        />
                    </div>
                )}
                {uploading && (
                    <div className={styles["progress-container"]}>
                        <Progress percent={uploadProgress} status="active" />
                    </div>
                )}
            </div>

        </div>
    );
}

export default UploadImage;