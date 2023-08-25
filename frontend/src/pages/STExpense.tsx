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
  DeploymentUnitOutlined
} from "@ant-design/icons";

// libs
import dayjs from 'dayjs';

import axios from "axios";

// api
import { getQuests, getSTExpense, putSTExpense } from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const navigate = useNavigate();

  const { eid } = useParams();

  const onClose = () => {
    navigate('/source-tables/expenses');
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

  const fetchExpenseSubCategories = async () => {
    const url = `http://127.0.0.1:8000/api/expense-sub-categories/`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.id,
        }));
        setOptionsSubCategories(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getSTExpense(eid);
      if (response.status === 200) {     
        const quests = response.data.quests.map((quest) => {
          return quest.id
        })        
        form.setFieldsValue({
          date: dayjs(response.data.date, 'DD.MM.YYYY'),
          amount: response.data.amount,
          name: response.data.name,
          subCategory: response.data.sub_category.id,
          quests: quests
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await putSTExpense(eid, value);
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
  const [optionsSubCategories, setOptionsSubCategories] = useState([]);

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: FallOutlined,
      title: "расходы",
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
      to: '/source-tables/expenses'
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  useEffect(() => {
    fetchData();
    fetchQuests();
    fetchExpenseSubCategories();
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>исх. таблицы | расходы | редактирование</Title>
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
          <Col span={12}>
            <Form.Item
              name="amount"
              label="сумма расхода"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму расхода",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму расхода" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="наименование расхода"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите наименование расхода",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите наименование расхода" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="subCategory"
              label="подкатегория"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите подкатегорию",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите подкатегорию"
                options={optionsSubCategories}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
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
