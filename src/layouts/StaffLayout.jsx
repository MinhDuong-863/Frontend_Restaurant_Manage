import React, { useState } from 'react';
import {
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { GoPeople } from "react-icons/go";
import { FaUserCheck } from "react-icons/fa6";
import { Button, Image, Layout, Menu, theme } from 'antd';
import styles from './StaffLayout.module.scss'; // Import file SCSS
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const items = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Thống kê, báo cáo',
    },
    {
        key: '2',
        icon: <UsergroupAddOutlined />,
        label: 'Tạo tài khoản',
    },
    {
        key: '3',
        icon: <UserOutlined />,
        label: 'Người dùng',
    },
    {
        key: '4',
        icon: <GoPeople />,
        label: 'Quản lý nhân viên',
    },
    {
        key: '5',
        icon: <FaUserCheck />,
        label: 'Quản lý tuyển dụng',
    },
    {
        key: '6',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
    }
];
const StaffLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Sider theme='light' trigger={null} collapsible collapsed={collapsed}>
                <div className={styles['demo-logo-vertical']} > <Image preview={false}
                    width={"70%"}
                    src="https://res.cloudinary.com/utejobhub/image/upload/v1731935499/cnpm/qaii6wychx5fvndgappu.svg"
                /></div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header
                    className={styles['header-layout']}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className={styles['custom-header-button']}
                    />
                </Header>
                <Content
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                    className={styles['custom-content']}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default StaffLayout;
