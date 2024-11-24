import React, { Children, useEffect, useState } from 'react';
import {
    DashboardOutlined,
    FormOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    OrderedListOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { GoPeople } from "react-icons/go";
import { FaUserCheck, FaWpforms } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { Button, Image, Layout, Menu, message, theme } from 'antd';
import styles from './ManagerLayout.module.scss'; // Import file SCSS
import { Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../constant/path';
import { logout } from '../redux/action/authenSlice';
import { IoFastFoodOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import clientApi from '../client-api/rest-client-api';
import { removeCurrent, setCurrent } from '../redux/action/webSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons';

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
        icon: <DashboardOutlined />,
        label: 'Thống kê, báo cáo',
    },
    {
        key: '2',
        icon: <UsergroupAddOutlined />,
        label: 'Quản lý nhân viên',
        children: [
            {
                key: '2.1',
                icon: <UserOutlined />,
                label: 'Thông tin nhân viên',
            },
            {
                key: '2.2',
                icon: <FaTasks />,
                label: 'Phân chia ca làm việc',
            },
            {
                key: '2.3',
                icon: <FaWpforms />,
                label: 'Đơn xin nghỉ',
            }
        ]
    },
    {
        key: '3',
        icon: <UserOutlined />,
        label: 'Quản lý nguyên liệu',
    },
    {
        key: '6',
        icon: <IoFastFoodOutline />,
        label: 'Quản lý món ăn',
    },
    {
        key: '4',
        icon: <FaUserCheck />,
        label: 'Quản lý tuyển dụng',
        children: [
            {
                key: '4.1',
                icon: <OrderedListOutlined />,
                label: 'Tin tuyển dụng',
            },
            {
                key: '4.2',
                icon: <FormOutlined />,
                label: 'Đơn ứng tuyển',
            },
        ]
    },
    {
        key: '5',
        icon: <FontAwesomeIcon icon={faList} />,
        label: 'Quản lý đơn đặt hàng',
    },
    {
        key: '7',
        icon: <FontAwesomeIcon icon={faMoneyBill1Wave} />,
        label: 'Quản lý giảm giá',
    },
    {
        key: '8',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
    }
];
const navigationMap = {
    "1": PATHS.MANAGER.DASHBOARD,
    "2": PATHS.MANAGER.STAFF,
    "2.1": PATHS.MANAGER.STAFF,
    "2.2": PATHS.MANAGER.SHIFT,
    "2.3": PATHS.MANAGER.LEAVE_APPLICATION,
    "3": PATHS.MANAGER.INGREDIENT,
    "4": PATHS.MANAGER.RECRUITMENT,
    "4.1": PATHS.MANAGER.RECRUITMENT,
    "4.2": PATHS.MANAGER.APPLICATION,
    "5": PATHS.MANAGER.ORDERMANAGER,
    "6": PATHS.MANAGER.FOOD,
    "7": PATHS.MANAGER.PROMOTION,
    "8": PATHS.HOME.LOGOUT,
}
const ManagerLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [index, setIndex] = useState(useSelector(state => state.web));
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const role = useSelector(state => state.authen.user.role);
    useEffect(() => {
        if (role !== 'manager') {
            dispatch(logout());
            message.error('Bạn không có quyền truy cập vào trang này');
            navigate("/login")
        };
    }, [])
    useEffect(() => {
        const Logout = async () => {
            clientApi.service('').logout().then(res => {
                if (res.EC === 0) {
                    navigate(PATHS.HOME.LOGIN);
                    dispatch(logout());
                    dispatch(removeStaffInfor());
                    message.success(res.EM);

                } else {
                    message.error(res.EM);
                }
            })
        }
        const navigateSideBar = async (e) => {
            const path = navigationMap[e];
            if (path) {
                if (path === PATHS.HOME.LOGOUT) {
                    dispatch(removeCurrent())
                    await Logout();
                } else {
                    navigate(path);
                }
            }
        };
        navigateSideBar(index);
    }, [index]);
    return (
        <Layout>
            <Sider width={250} style={siderStyle} theme='light' trigger={null} collapsible collapsed={collapsed}>
                <div className={styles['demo-logo-vertical']} > <Image preview={false}
                    width={"80%"}
                    src="https://res.cloudinary.com/dup39fo44/image/upload/v1731979004/Restaurant-Management/kngprvirnnw6znrbkgz0.svg"
                /></div>
                <Menu
                    selectedKeys={index}
                    onClick={(e) => {
                        dispatch(setCurrent(e.key))
                        setIndex(e.key);
                    }}
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

export default ManagerLayout;
