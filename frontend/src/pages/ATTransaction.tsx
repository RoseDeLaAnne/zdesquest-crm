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

// api
import { getTransaction, putTransaction } from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const navigate = useNavigate();

  const { tid } = useParams();

  const onClose = () => {
    navigate("/additional-tables/transactions");
  };

  const fetchData = async () => {
    try {
      const response = await getTransaction(tid);
      if (response.status === 200) {
        form.setFieldsValue({
          date: dayjs(response.data.date, "DD.MM.YYYY"),
          amount: response.data.amount,
          name: response.data.name,
          status: response.data.status,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await putTransaction(tid, value);
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
  const [optionsStatuses, setOptionsStatus] = useState([
    {
      'value': 'error',
      "label": 'отклонена'
    },
    {
      'value': 'processing',
      "label": 'в ожидании'
    },
    {
      'value': 'success',
      "label": 'одобрена'
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: FallOutlined,
      title: "транзакции",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "транзакции",
          to: "/additional-tables/transactions",
        },
      ],
      to: "/additional-tables/transactions",
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
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesTransactions"]}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>транзакции | редактирование</Title>
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
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="status"
              label="статус"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите статус",
                },
              ]}
            >
              <Select
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="пожалуйста, выберите статус"
                  options={optionsStatuses}
                />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Template>
  );
};

export default App;
