import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Modal } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import clientApi from '../../../client-api/rest-client-api';
import { TYPE_OF_FOOD } from '../../../constant/values';
const { TextArea } = Input;
const { Option } = Select;

const CreateFoodModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      message.error('Failed to upload image');
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
        name: values.name,
        image: imageUrl,
        price: values.price,
        description: values.description,
        type: values.type,
        status: 'active' // Default status for new items
      };

      // const response = await createFood(foodData);
      const response= await clientApi.service('foods').create(foodData);
      if(response.EC===0){
        message.success('Thêm mới món ăn thành công');
      }else{
        message.error('Thêm mới món ăn thất bại');
    }
      form.resetFields();
      setImageUrl('');
      setUploadProgress(0);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl('');
    setUploadProgress(0);
    onCancel();
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8}}>
        {uploading ? `Tải lên... ${uploadProgress}%` : 'Tải lên'}
      </div>
    </div>
  );

  return (
    <Modal
      title="Thêm mới món ăn"
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
          Thêm mới
        </Button>
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          price: 0,
          type: 'Món chính'
        }}
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
              <img 
                src={imageUrl} 
                alt="Food" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
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
         {/*select type món ăn từ TYPE_OF_FOOD */}
            <Select
                placeholder="Chọn loại món ăn"
                optionFilterProp="label"
                options={TYPE_OF_FOOD}
                style={{ minWidth: '200px', height: '3em' }}
                allowClear
            />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFoodModal;