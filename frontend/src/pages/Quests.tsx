import React, { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link } from "react-router-dom";

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
import axios from "axios";

import Highlighter from "react-highlight-words";

// api
import { getQuests, deleteQuest, postQuest } from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

const App: FC = () => {
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleDelete = async (name: React.Key) => {
    const response = await deleteQuest(name);
    if (response.status === 200) {
      const newData = data.filter((item) => item.latin_name !== name);
      setData(newData);
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    title: string
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`поиск по ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            поиск
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            сброс
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const showDrawer = () => {
    setOpen(true);
    localStorage.setItem("questsDrawerIsOpen", "true");
  };

  const onClose = () => {
    setOpen(false);
    localStorage.setItem("questsDrawerIsOpen", "false");
  };

  const fetchData = async () => {
    const response = await getQuests();
    if (response.status === 200) {
      setData(response.data);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await postQuest(value);
      if (response.status === 201) {
        messageApi.open({
          type: "success",
          content: "запись создана",
        });
        fetchData();
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не создана",
      });
    }
  };

  const [open, setOpen] = useState(
    localStorage.getItem("questsDrawerIsOpen")
      ? localStorage.getItem("questsDrawerIsOpen") === "true"
      : false
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<DataType[]>([]);
  const [dates, setDates] = useState([]);
  const [quests, setQuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [optionsAdministrators, setAdministrators] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
    },
  ];
  const columns = [
    {
      title: "Ключевое название",
      dataIndex: "latin_name",
      key: "latin_name",
      ...getColumnSearchProps("latin_name", "ключевому названию"),
      sorter: {
        compare: (a, b) => a.latin_name - b.latin_name,
      },
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name", "названию"),
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address", "адресу"),
      sorter: {
        compare: (a, b) => a.address - b.address,
      },
    },
    {
      title: "Ставка",
      dataIndex: "rate",
      key: "rate",
      ...getColumnSearchProps("rate", "ставке"),
      sorter: {
        compare: (a, b) => a.rate - b.rate,
      },
    },
    {
      title: "операция",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        data.length >= 1 ? (
          <Space>
            <Link to={`edit/${record.latin_name}`}>редактировать</Link>
            <Popconfirm
              title="уверены, что хотите удалить?"
              onConfirm={() => handleDelete(record.latin_name)}
            >
              <a>удалить</a>
            </Popconfirm>
          </Space>
        ) : null,
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
        <Title>квесты</Title>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          новая запись
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        summary={() => {
          if (data.length === 0) {
            return null;
          }

          let totalRate = 0;

          data.forEach(({ rate }) => {
            totalRate += rate;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{totalRate}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      <Drawer
        title="создать новую запись"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>отмена</Button>
            <Button onClick={() => form.submit()} type="primary">
              создать
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="latin_name"
                label="ключевое название"
                rules={[
                  { required: true, message: "пожалуйста, введите ключевое название" },
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
      </Drawer>
    </Template>
  );
};

export default App;
