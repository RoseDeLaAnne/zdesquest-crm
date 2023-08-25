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
import { getQuest, putQuest } from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const navigate = useNavigate();

  const { name } = useParams();

  const onClose = () => {
    navigate("/quests");
  };

  const fetchData = async () => {
    const response = await getQuest(name);
    if (response.status === 200) {
      form.setFieldsValue({
        latin_name: response.data.latin_name,
        name: response.data.name,
        address: response.data.address,
        rate: response.data.rate,
      });
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await putQuest(name, value);
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
  const [data, setData] = useState<DataType[]>([]);
  const [quests, setQuests] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [optionsSubCategories, setOptionsSubCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["quests"]}
      defaultSelectedKeys={["quests"]}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>квесты | редактирование</Title>
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
              name="latin_name"
              label="ключевое название"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите ключевое название",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите ключевое название" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="название"
              rules={[
                { required: true, message: "пожалуйста, введите название" },
              ]}
            >
              <Input placeholder="пожалуйста, введите название" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="address"
              label="адрес"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите адрес",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите адрес" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="rate"
              label="ставка"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите ставку",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите ставку" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Template>
  );
};

export default App;
