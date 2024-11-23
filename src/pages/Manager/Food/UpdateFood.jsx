import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Modal } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import clientApi from '../../../client-api/rest-client-api';
import { TYPE_OF_FOOD } from '../../../constant/values';
import './UpdateFood.scss';
const { TextArea } = Input;

const UpdateFoodModal = ({ visible, onCancel, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load initial data when modal opens
  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        name: initialData.name,
        price: initialData.price,
        description: initialData.description,
        type: initialData.type
      });
      setImageUrl(initialData.image);
    }
  }, [visible, initialData, form]);

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const url = await uploadToCloudinary(
        file, 
        'foods',
        (progress) => setUploadProgress(progress)
      );
      
      setImageUrl(url);
      message.success('Tải hình ảnh món ăn thành công');
      return url;
    } catch (error) {
      message.error('Tải hình ảnh thất bại');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      
      if (!imageUrl) {
        message.error('Vui lòng tải lên hình ảnh món ăn');
        return;
      }

      // Prepare the food data
      const foodData = {
        ...initialData, 
        name: values.name,
        image: imageUrl,
        price: values.price,
        description: values.description,
        type: values.type,
      };

      const response = await clientApi.service('foods').put(initialData._id, foodData);
      
      if (response.EC === 0) {
        message.success('Cập nhật món ăn thành công');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        message.error('Cập nhật món ăn thất bại');
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <UploadOutlined />}
      <div className="mt-2">
        {uploading ? `Tải lên... ${uploadProgress}%` : 'Tải lên'}
      </div>
    </div>
  );

  return (
    <Modal
      title="Cập nhật món ăn"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={() => form.submit()}
        >
          Cập nhật
        </Button>
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Tên món ăn"
          rules={[{ required: true, message: 'Vui lòng điền thông tin món ăn' }]}
        >
          <Input placeholder="Nhập tên món ăn" />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          required
          tooltip="Hình ảnh sẽ được hiển thị trên menu"
          extra="Nhấp vào ảnh để cập nhật ảnh mới.Chỉ chấp nhận file ảnh dạng JPG, PNG"
        >
         <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={async (file) => {
            await handleImageUpload(file);
            return false;
            }}
        >
            {imageUrl ? (
            <div className="upload-image-container">
                {uploading ? (
                <div className="loading-overlay">
                    <LoadingOutlined />
                    <span>{uploadProgress}%</span>
                </div>
                ) : null}
                <img 
                src={imageUrl} 
                alt="Food" 
                className="w-full h-full object-cover" 
                />
                {!uploading && (
                <div className="upload-overlay">
                    <UploadOutlined />
                    <span>Cập nhật ảnh</span>
                </div>
                )}
            </div>
            ) : (
            uploadButton
            )}
        </Upload>
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VND)"
          rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            className="w-full"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            min={0}
            placeholder="Nhập giá món ăn"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả món ăn"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Nhập mô tả"
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại món ăn"
          rules={[{ required: true, message: 'Chọn loại món ăn' }]}
        >
          <Select
            placeholder="Chọn loại món ăn"
            optionFilterProp="label"
            options={TYPE_OF_FOOD}
            className="min-w-[200px] h-12"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateFoodModal;