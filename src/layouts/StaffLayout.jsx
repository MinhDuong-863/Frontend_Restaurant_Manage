import React, { useEffect, useState } from 'react';
import {
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { MdTableRestaurant } from "react-icons/md";
import { TbReservedLine } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import { Avatar, Button, Flex, Image, Layout, Menu, message, theme, Typography } from 'antd';
import styles from './StaffLayout.module.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from '../constant/path';
import { logout } from '../redux/action/authenSlice';
import { removeStaffInfor, setStaffInfor } from "../redux/action/staffSlice";
import clientApi from '../client-api/rest-client-api';
import { removeCurrent, setCurrent } from '../redux/action/webSlice';

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
        icon: <MdTableRestaurant />,
        label: 'Bàn ăn',
    },
    {
        key: '4',
        icon: <TbReservedLine />,
        label: 'Đặt trước',
    },
    {
        key: '5',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
    }
];
const navigationMap = {
    "1": PATHS.STAFF.INFORMATION,
    "2": PATHS.STAFF.CALENDAR,
    "3": PATHS.STAFF.TABLE,
    "4": PATHS.STAFF.BOOKING,
    "5": PATHS.HOME.LOGOUT,
}
const StaffLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [index, setIndex] = useState(useSelector(state => state.web));
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const infor = useSelector(state => state.authen.user); // thông tin cá nhân
    useEffect(() => {
        console.log(index);
        const Logout = async () => {
            clientApi.service('').logout().then(res => {
                if (res.EC === 0) {
                    navigate(PATHS.HOME.LOGIN);
                    dispatch(logout());
                    dispatch(removeStaffInfor());
                    dispatch(removeCurrent());
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

    useEffect(() => {
        if (infor.role !== 'staff') {
            dispatch(logout());
            message.error('Bạn không có quyền truy cập vào trang này');
            navigate("/login")
            return
        };
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
                    selectedKeys={useSelector(state => state.web)}
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={(e) => {
                        dispatch(setCurrent(e.key))
                        setIndex(e.key);
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
                            <Avatar size={"large"} icon={<UserOutlined />} src={infor?.avatar} />
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
