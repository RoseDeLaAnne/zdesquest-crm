import React, { FC, ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Skeleton,
  Layout,
  Typography,
  Form,
  Button,
  Result,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import axios from "axios";

import SideBar from "../components/SideBar";
import CustomBreadcrumb from "../components/Breadcrumb";
import Main from "../components/Main";

const { Title } = Typography;

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

const sideBarItems: MenuItem[] = [
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

const breadCrumbItems = [
  {
    text: "Главная",
    link: "/",
  },
  {
    text: "404",
    link: "",
  },
];

const App: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout hasSider>
      <SideBar items={sideBarItems} />
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <CustomBreadcrumb items={breadCrumbItems} />
        <Main>
          <Result
            status="404"
            title="404"
            subTitle="Извините, страница, которую вы посетили, не существует"
            extra={
              <Button type="primary" style={{ textTransform: "lowercase" }}>
                На главную
              </Button>
            }
            style={{ textTransform: "lowercase" }}
          />
        </Main>
      </Layout>
    </Layout>
  );
};

export default App;
