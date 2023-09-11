import React, { FC, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams, useNavigate } from "react-router-dom";

// antd
import {
  Typography,
  Layout,
  Menu,
  Breadcrumb,
  theme,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Select,
  Space,
  Tag,
  Button,
  Input,
  Table,
  Popconfirm,
  message,
} from "antd";

// antd | icons
import {
  HomeOutlined,
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
  TableOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// libs
import dayjs from "dayjs";

// components
import CSider from "../components/CSider";
import CBreadcrumb from "../components/CBreadcrumb";

import CForm from "../components/CForm";

// interface
import { IFC } from "../assets/utilities/interface";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  title,
  fetchFunction,
  putFunction,
  formItems,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { id } = useParams();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("collapsed")
      ? localStorage.getItem("collapsed") === "true"
      : false
  );

  const onClose = () => {
    navigate(breadcrumbItems[breadcrumbItems.length - 2].to);
  };

  const fetchData = async () => {
    try {
      const response = await fetchFunction(id);
      if (response.status === 200) {
        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) {
            const value = response.data[key];

            if (key === "date") {
              const date = dayjs(value, "DD.MM.YYYY");
              form.setFieldsValue({ [key]: date });
            } else if (key === "time") {
              const time = dayjs(value, "HH:mm:ss");
              form.setFieldsValue({ [key]: time });
            } else if (key === "user") {
              form.setFieldsValue({ [key]: value.id });
            } else if (key === "quest") {
              form.setFieldsValue({ [key]: value.id });
            } else {
              form.setFieldsValue({ [key]: value });
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const [form] = Form.useForm();
  const formOnFinish = async (value: object) => {
    try {
      const date = dayjs(value.date);
      const updatedDate = date.add(1, "day");
      value.date = updatedDate;
      const response = await putFunction(id, value);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "запись отредактирована",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не отредактирована",
      });
    }
  };

  useEffect(() => {
    document.title = title;

    fetchData();
  }, []);

  return (
    <Layout hasSider>
      <CSider
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
      />
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <CBreadcrumb items={breadcrumbItems} />

        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          {contextHolder}
          <div
            style={{
              padding: 16,
              minHeight: "calc(100vh - 48px - 22px - 24px)",
              background: colorBgContainer,
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Title>{title}</Title>
              <Space>
                <Button onClick={onClose}>отмена</Button>
                <Button onClick={() => form.submit()} type="primary">
                  сохранить
                </Button>
              </Space>
            </div>
            <CForm items={formItems} form={form} onFinish={formOnFinish} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
