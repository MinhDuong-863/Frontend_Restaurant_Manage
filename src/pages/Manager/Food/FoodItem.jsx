import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tag, Button, Typography, Space, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import '../staff.scss';
import { TYPE_OF_FOOD } from '../../../constant/values';
const { Title, Text } = Typography;

const FoodItemManagement = ({ foodItem, onFoodSelect }) => {
  // Format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Limit text length and add ellipsis
  const truncateText = (text, limit) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const getTagColor = (type) => {
    const colorMap = {
      'Món khai vị': 'cyan',
      'Món chính': 'blue',
      'Món ăn kèm': 'green',
      'Món tráng miệng': 'purple',
      'Đồ uống': 'orange',
      'Món đặc sản': 'red'
    };
    return colorMap[type] || 'default';
  };  
  const TYPE_MAPPING = TYPE_OF_FOOD.reduce((acc, item) => {
    acc[item.value.toLowerCase()] = item.label;
    return acc;
  }, {});

  const getFoodTypeLabel = (type) => {
    return TYPE_MAPPING[type.toLowerCase()] || type;
  };
  return (
    <Card
      hoverable
      style={{ 
        marginBottom: 16,
        borderRadius: 8 
      }}
      bodyStyle={{ 
        padding: 16,
        height: '100%'
      }}
    >
      <div style={{ 
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start'
      }}>
        <div style={{
          width: 120,
          height: 120,
          flexShrink: 0,
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          <img
            src={foodItem.image}
            alt={foodItem.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}>
          <Space direction="vertical" size={4}>
            <Tooltip title={foodItem.name}>
              <Title level={4} style={{ 
                margin: 0,
                marginBottom: 4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {foodItem.name}
              </Title>
            </Tooltip>

            <Text type="success" strong style={{ fontSize: 16 }}>
              {formatPrice(foodItem.price)}
            </Text>

            <Tag color={getTagColor(getFoodTypeLabel(foodItem.type))}>
              {getFoodTypeLabel(foodItem.type)}
            </Tag>

            {foodItem.description && (
              <Tooltip title={foodItem.description}>
                <Text type="secondary" style={{
                  display: 'block',
                  marginTop: 8,
                  lineHeight: '1.5em',
                  height: '3em',
                  overflow: 'hidden'
                }}>
                  {truncateText(foodItem.description, 100)}
                </Text>
              </Tooltip>
            )}
          </Space>

          <div style={{ 
            marginTop: 16,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Button
              icon={<EditOutlined />}
              onClick={() => onFoodSelect(foodItem)}
            >
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

FoodItemManagement.propTypes = {
  foodItem: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  onFoodSelect: PropTypes.func.isRequired
};

export default FoodItemManagement;