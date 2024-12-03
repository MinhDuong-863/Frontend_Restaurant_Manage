import React, { useEffect, useState } from 'react';
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
import { Button, Image, Layout, Menu, message, theme } from 'antd';
import styles from './AdminLayout.module.scss'; // Import file SCSS
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/action/authenSlice';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../constant/path';

const { Header, Sider, Content } = Layout;

const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
};
const items = [
    {
        key: '1',
        icon: <i className="fa-solid fa-chart-pie"></i>,
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
        label:  (<NavLink to={PATHS.ADMIN.STAFF}>Quản lý nhân viên</NavLink>),
    },
    {
        key: '5',
        icon: <FaUserCheck />,
        label: 'Quản lý tuyển dụng',
    },
    {
        key: '6',
        icon: <i className="fa-solid fa-ticket-simple"></i>,
        label: (<NavLink to={PATHS.ADMIN.PROMOTION}>Quản lý khuyến mại</NavLink>),
    },
    {
        key: '7',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
    }
];
const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = useSelector(state => state.authen.user.role);
    useEffect(() => {

        console.log(role);
        if (role !== 'admin') {
            dispatch(logout());
            message.error('Bạn không có quyền truy cập vào trang này');
            navigate("/login")
        };
    }, [])
    return (
        <Layout>
            <Sider width={215} style={siderStyle} theme='light' trigger={null} collapsible collapsed={collapsed}>
                <div className={styles['demo-logo-vertical']} > <Image preview={false}
                    width={"80%"}
                    src="https://res.cloudinary.com/dup39fo44/image/upload/v1731979004/Restaurant-Management/kngprvirnnw6znrbkgz0.svg"
                /></div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                />
            </Sider>
            <Layout style={{ marginInlineStart: 0, scrollbarWidth: "thin" }}>
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
                        overflow: 'initial',
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

export default AdminLayout;
