import React, { useState, useEffect } from 'react';
import clientApi from '../../client-api/rest-client-api';
import { Card, Row, Col, Statistic, Progress, Table, Select, Space, message } from 'antd';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  MoneyCollectOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Option } = Select;

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: null,
    year: null
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topSellingDishes, setTopSellingDishes] = useState([]);
  const [menuCategoryData, setMenuCategoryData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // Dummy data (replace with actual API calls)
  const COLORS = ['#722ed1', '#2f54eb', '#1890ff', '#13c2c2', '#52c41a'];


  const tableColumns = [
    { title: 'Món ăn', dataIndex: 'dish', key: 'dish' },
    {
      title: 'Đã bán',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a, b) => a.sales - b.sales
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => `VND ${value.toLocaleString()}`,
      sorter: (a, b) => a.revenue - b.revenue
    }
  ];
  const getRevenue = async () => {
    try {
      setLoading(true);
      const params = {
        year: filters.year || 2024,
        month: filters.month || 11
      };

      const response = await clientApi.service('/report/revenue').find(params);

      if (response.EC === 200) {
        // Handle potential multiple data entries for different time periods
        const revenueDetails = response.DT.length > 0 ? response.DT : [];

        // Aggregate data across all returned entries
        const aggregatedData = revenueDetails.reduce((acc, entry) => {
          acc.totalRevenue += entry.totalRevenue;
          acc.totalOrders += entry.totalOrders;
          acc.soldItems.push(...entry.soldItems);
          return acc;
        }, {
          totalRevenue: 0,
          totalOrders: 0,
          soldItems: []
        });

        // Process sold items for top-selling dishes
        const processedTopSelling = aggregatedData.soldItems.reduce((acc, item) => {
          const existingItem = acc.find(x => x.dish === item.name);
          if (existingItem) {
            existingItem.sales += item.quantitySold;
            existingItem.revenue += item.price * item.quantitySold;
          } else {
            acc.push({
              dish: item.name,
              sales: item.quantitySold,
              revenue: item.price * item.quantitySold
            });
          }
          return acc;
        }, [])
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        // Calculate menu category data
        const categoryMap = aggregatedData.soldItems.reduce((acc, item) => {
          const categoryName = item.name.split(' ')[0]; // Simple categorization
          if (!acc[categoryName]) {
            acc[categoryName] = {
              name: categoryName,
              value: 0,
              percentage: 0
            };
          }
          acc[categoryName].value += item.quantitySold;
          return acc;
        }, {});

        const processedCategoryData = Object.values(categoryMap).map(category => ({
          ...category,
          percentage: Math.round((category.value / aggregatedData.soldItems.length) * 100)
        }));

        // Set states
        setTotalRevenue(aggregatedData.totalRevenue);
        setTotalOrders(aggregatedData.totalOrders);
        setTopSellingDishes(processedTopSelling);
        setMenuCategoryData(processedCategoryData);

        // Prepare revenue data with more flexibility
        const revenueData = revenueDetails.map(entry => ({
          month: entry._id.month ?
            new Date(2024, entry._id.month - 1).toLocaleString('default', { month: 'short' }) :
            `${entry._id.year || 'Unknown'}`,
          revenue: entry.totalRevenue,
          orders: entry.totalOrders
        }));

        setRevenueData(revenueData);
      } else {
        message.error('Failed to retrieve revenue data');
      }
      setLoading(false);
    } catch (error) {
      message.error('Failed to get revenue data');
      setLoading(false);
    }
  };

  useEffect(() => {
    getRevenue();
  }, [filters.year, filters.month]);
  const FilterControls = () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={filters.month}
          onChange={(value) => setFilters(prev => ({ ...prev, month: value }))}
          style={{ width: 120 }}
          placeholder="Chọn tháng"
        >
          <Option value={null}>Chọn tháng</Option>
          {months.map(month => (
            <Option key={month} value={month}>Tháng {month}</Option>
          ))}
        </Select>
        <Select
          value={filters.year}
          onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
          style={{ width: 120 }}
          placeholder="Chọn năm"
        >
          <Option value={null}>Chọn năm</Option>
          {years.map(year => (
            <Option key={year} value={year}>{year}</Option>
          ))}
        </Select>
      </Space>
    );
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 16 }}>
        <FilterControls />
      </Card>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số lượng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue and Performance */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={24}>
          <Card title="Doanh thu theo tháng">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === 'Doanh thu (VND)'
                      ? [new Intl.NumberFormat('vi-VN').format(value) + ' VND', name]
                      : [value, name]
                  }
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  name="Doanh thu (VND)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#1890ff"
                  name="Tổng số đơn hàng"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Menu and Performance Details */}
      <Card title="Món ăn bán nhiều nhất">
        <Table
          columns={tableColumns}
          dataSource={topSellingDishes}
          pagination={false}
        />
      </Card>

    </div>
  );
};

export default ManagerDashboard;