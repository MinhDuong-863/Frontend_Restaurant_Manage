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
import { FaCalendarAlt } from "react-icons/fa";
import { Avatar, Button, Flex, Image, Layout, Menu, message, theme, Typography } from 'antd';
import styles from './StaffLayout.module.scss'; // Import file SCSS
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from '../constant/path';
import { logout } from '../redux/action/authenSlice';
import { removeStaffInfor, setStaffInfor } from "../redux/action/staffSlice";
import clientApi from '../client-api/rest-client-api';

const { Text } = Typography;
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
        label: 'thông tin cá nhân',
    },
    {
        key: '2',
        icon: <FaCalendarAlt />,
        label: 'Lịch làm việc',
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
const navigationMap = {
    "1": PATHS.STAFF.INFORMATION,
    "2": PATHS.STAFF.CALENDAR,
    "3": "/staff/users",
    "4": "/staff/staff",
    "5": "/staff/recruitment",
    "6": PATHS.HOME.LOGOUT,
}
const StaffLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [index, setIndex] = useState('1');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const infor = useSelector(state => state.authen.user); // thông tin cá nhân
    const token = useSelector(state => state.authen.token);
    useEffect(() => {
        console.log(index);
        const Logout = async () => {
            let authen = clientApi.service('', token);
            authen.logout().then(res => {
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
                    await Logout();
                } else {
                    navigate(path);
                }
            }
        };
        navigateSideBar(index);
    }, [index]);
    useEffect(() => {
        clientApi.service('staff/infor').get('').then(res => {
            dispatch(setStaffInfor({ ...res.DT[0] }));
            console.log("res.DT[0]:", res.DT[0]);
        })
    }, []);

    return (
        <Layout>
            <Sider style={siderStyle} width={215} theme='light' trigger={null} collapsible collapsed={collapsed}>
                <div className={styles['demo-logo-vertical']} > <Image preview={false}
                    width={"100%"}
                    src="https://res.cloudinary.com/dup39fo44/image/upload/v1732023125/image/qp96r8yjyefqhm4zah3g.png"
                /></div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={(e) => {
                        setIndex(e.key)
                    }}
                    items={items}
                />
            </Sider>
            <Layout style={{ marginInlineStart: 0 }}>
                <Header
                    className={styles['header-layout']}
                >
                    <Flex justify='space-between' align='center'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className={styles['custom-header-button']}
                        />
                        <Flex align='center' gap={8}>
                            <Avatar size={"large"} icon={<UserOutlined />} src={infor.avatar} />
                            <Text className={styles['user-name']} level={5}>{infor.first_name + " " + infor.last_name}</Text>
                        </Flex>
                    </Flex>
                </Header>
                <Content
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                    className={styles['custom-content']}>
                    <div><Outlet /></div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default StaffLayout;
