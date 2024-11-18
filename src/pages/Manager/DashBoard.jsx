import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Select, Space } from 'antd';
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

  // Dummy data (replace with actual API calls)
  const COLORS = ['#722ed1', '#2f54eb', '#1890ff', '#13c2c2', '#52c41a'];

  // Static sample data (to be replaced with actual API data)
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 135 },
    { month: 'Mar', revenue: 61000, orders: 150 },
    { month: 'Apr', revenue: 58000, orders: 142 },
    { month: 'May', revenue: 65000, orders: 160 },
    { month: 'Jun', revenue: 72000, orders: 175 }
  ];

  const menuCategoryData = [
    { name: 'Appetizers', value: 250, percentage: 25 },
    { name: 'Main Courses', value: 350, percentage: 35 },
    { name: 'Desserts', value: 200, percentage: 20 },
    { name: 'Beverages', value: 150, percentage: 15 },
    { name: 'Specials', value: 50, percentage: 5 }
  ];

  const topSellingDishes = [
    { dish: 'Signature Steak', sales: 450, revenue: 13500 },
    { dish: 'Seafood Pasta', sales: 380, revenue: 11400 },
    { dish: 'Chocolate Lava Cake', sales: 320, revenue: 6400 },
    { dish: 'Grilled Salmon', sales: 280, revenue: 8400 },
    { dish: 'Margherita Pizza', sales: 250, revenue: 7500 }
  ];

  const tableColumns = [
    { title: 'Dish', dataIndex: 'dish', key: 'dish' },
    { 
      title: 'Sales', 
      dataIndex: 'sales', 
      key: 'sales',
      sorter: (a, b) => a.sales - b.sales
    },
    { 
      title: 'Revenue', 
      dataIndex: 'revenue', 
      key: 'revenue',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.revenue - b.revenue
    }
  ];

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
          placeholder="Select Month"
        >
          <Option value={null}>All Months</Option>
          {months.map(month => (
            <Option key={month} value={month}>Month {month}</Option>
          ))}
        </Select>
        <Select
          value={filters.year}
          onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
          style={{ width: 120 }}
          placeholder="Select Year"
        >
          <Option value={null}>All Years</Option>
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
              title="Total Revenue"
              value={72000}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={175}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New Customers"
              value={45}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Order Value"
              value={411}
              prefix={<MoneyCollectOutlined style={{ color: '#13c2c2' }} />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue and Performance */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Revenue and Orders">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#52c41a" 
                  name="Revenue (USD)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#1890ff" 
                  name="Total Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Menu Category Sales">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={menuCategoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={110}
                  fill="#722ed1"
                  label={({name, value, percentage}) => `${value} items - ${percentage}%`}
                >
                  {menuCategoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Menu and Performance Details */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Top Selling Dishes">
            <Table 
              columns={tableColumns} 
              dataSource={topSellingDishes}
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Performance Metrics">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div>Table Turnover Rate</div>
                <Progress percent={75} status="active" />
              </div>
              <div>
                <div>Customer Satisfaction</div>
                <Progress percent={92} status="active" />
              </div>
              <div>
                <div>Menu Item Profitability</div>
                <Progress percent={68} status="active" />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Order Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Dine-In', value: 100 },
                { name: 'Takeaway', value: 60 },
                { name: 'Delivery', value: 40 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboard;