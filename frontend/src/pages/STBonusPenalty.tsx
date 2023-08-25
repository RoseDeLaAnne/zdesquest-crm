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

// api
import {
  getBonusPenalty,
  getQuests,
  getUsers,
  postBonusPenalty,
  putBonusPenalty,
} from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const navigate = useNavigate();

  const { bpid } = useParams();

  const onClose = () => {
    navigate("/source-tables/bonuses-penalties");
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await getQuests();
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

  const fetchData = async () => {
    try {
      const response = await getBonusPenalty(bpid);
      if (response.status === 200) {
        const quests = response.data.quests.map((quest) => {
          return quest.id;
        });
        form.setFieldsValue({
          date: dayjs(response.data.date, "DD.MM.YYYY"),
          bonus: response.data.bonus,
          penalty: response.data.penalty,
          user: response.data.user.id,
          quests: quests,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await putBonusPenalty(bpid, value);
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
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: DeploymentUnitOutlined,
      title: "бонусы/штрафы",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "квесты",
          to: "/source-tables/quests",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/source-tables/expenses",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "бонусы/штрафы",
          to: "/source-tables/bonuses-penalties",
        },
      ],
      to: "/source-tables/bonuses-penalties",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  useEffect(() => {
    fetchData(null, null);
    fetchUsers();
    fetchQuests();
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesBonusesPenalties"]}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>исх. таблицы | бонусы/штрафы | редактирование</Title>
        <Space>
          <Button onClick={onClose}>отмена</Button>
          <Button onClick={() => form.submit()} type="primary">
            сохранить
          </Button>
        </Space>
      </div>
      <Form form={form} layout="vertical" hideRequiredMark onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="date"
              label="дата"
              rules={[{ required: true, message: "пожалуйста, введите дату" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="user"
              label="сотрудник"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите сотрудника",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите сотрудника"
                options={optionsUsers}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="penalty"
              label="сумма штрафа"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму штрафа",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму штрафа" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="bonus"
              label="сумма бонуса"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму бонуса",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму бонуса" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="quests"
              label="квесты"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите квесты",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите квесты"
                options={optionsQuests}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Template>
  );
};

export default App;
