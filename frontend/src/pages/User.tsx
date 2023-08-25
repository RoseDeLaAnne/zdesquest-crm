import React, { FC, useState, useEffect, useRef } from "react";

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
// antd | type
import type { MenuProps, InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type {
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
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
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// libs
import dayjs from "dayjs";

import axios from "axios";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const onClose = () => {
    navigate("/users");
  };

  const fetchData = async () => {
    const url = `http://127.0.0.1:8000/api/user/${id}`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const roles = response.data.roles.map((role) => {
          return role.id;
        });
        form.setFieldsValue({
          date: dayjs(response.data.date, "DD.MM.YYYY"),
          username: response.data.username,
          last_name: response.data.last_name,
          first_name: response.data.first_name,
          middle_name: response.data.middle_name,
          roles: roles,
          quest: response.data.quest.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    const url = `http://127.0.0.1:8000/api/roles/`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.id,
        }));
        setOptionsRoles(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuests = async () => {
    const url = `http://127.0.0.1:8000/api/quests/`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.id,
        }));
        setOptionsQuests(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    const url = `http://127.0.0.1:8000/api/user/${id}/`;
    try {
      console.log(value);
      const response = await axios.put(url, value);
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

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [optionsRoles, setOptionsRoles] = useState([]);

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "сотрудники",
      to: "/users",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  useEffect(() => {
    fetchData();
    fetchRoles();
    fetchQuests();
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultSelectedKeys={["users"]}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>сотрудники | редактирование</Title>
        <Space>
          <Button onClick={onClose}>отмена</Button>
          <Button onClick={() => form.submit()} type="primary">
            сохранить
          </Button>
        </Space>
      </div>
      <Form form={form} layout="vertical" hideRequiredMark onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="логин"
              rules={[{ required: true, message: "пожалуйста, введите логин" }]}
            >
              <Input placeholder="пожалуйста, введите логин" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="пароль"
              rules={[
                { required: false, message: "пожалуйста, введите пароль" },
              ]}
            >
              <Input placeholder="пожалуйста, введите пароль" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="last_name"
              label="Фамилия"
              rules={[
                { required: true, message: "пожалуйста, введите фамилию" },
              ]}
            >
              <Input placeholder="пожалуйста, введите фамилию" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="first_name"
              label="Имя"
              rules={[{ required: true, message: "пожалуйста, введите имя" }]}
            >
              <Input placeholder="пожалуйста, введите имя" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="middle_name"
              label="Отчество"
              rules={[
                { required: true, message: "пожалуйста, введите отчество" },
              ]}
            >
              <Input placeholder="пожалуйста, введите отчество" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="quest"
              label="квест"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите квест",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите квест"
                options={optionsQuests}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roles"
              label="роли"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите роли",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите роли"
                options={optionsRoles}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Template>
  );
};

export default App;
