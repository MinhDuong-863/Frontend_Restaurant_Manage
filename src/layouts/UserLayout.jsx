import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import './UserLayout.scss';
import UserHeader from "../components/UserHeader/UserHeader";

const UserLayout = () => {
    return (
        <Layout className="layout">
            <UserHeader className="header" />
            <Content className="content">
                <Outlet />
            </Content>
        </Layout>
    );
};

export default UserLayout;
