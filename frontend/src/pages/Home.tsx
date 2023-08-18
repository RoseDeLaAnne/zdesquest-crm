import React, { useState, FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, Button, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface MainProps {
  children: ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  to: string, // Add the 'to' prop for the link
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    // Wrap the label in a Link component
    label: <Link to={to}>{label}</Link>,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Пользователи", "users", "/users", <UserOutlined />),

  getItem("Квесты", "quests", "/quests", <QuestionOutlined />, [
    getItem("Радуга", "sub3", "/quests", <QuestionOutlined />, [
      getItem("Доходы", "11", "/quests", <RiseOutlined />),
      getItem("Расходы", "12", "/quests", <FallOutlined />),
      getItem("Зарплаты", "13", "/quests", <DollarOutlined />),
    ]),
    getItem("Добавить", "questsAdd", "/quests/add", <AppstoreAddOutlined />),
  ]),
];

const App: FC<MainProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
          style={{
            marginTop: "8px",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <Breadcrumb
          style={{
            margin: "24px 16px 0",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <Breadcrumb.Item>Главная</Breadcrumb.Item>
          {/* <Breadcrumb.Item>
            <Link to="/quests">Квесты</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Квест «Радуга»</Breadcrumb.Item> */}
        </Breadcrumb>
        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 48px - 18.85px - 24px)",
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: "4px",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
