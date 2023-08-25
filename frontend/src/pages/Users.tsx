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
import { postUser } from "../api/APIUtils";

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

  const handleDelete = async (key: React.Key) => {
    const response = await deleteBonusPenalty(key);
    if (response.status === 200) {
      const newData = data.filter((item) => item.key !== key);
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
    localStorage.setItem("usersDrawerIsOpen", "true");
  };

  const onClose = () => {
    setOpen(false);
    localStorage.setItem("usersDrawerIsOpen", "false");
  };

  const loading = () => {
    messageApi.open({
      type: "loading",
      content: "получение данных..",
      duration: 0,
    });
  };

  const errorF = () => {
    messageApi.open({
      type: 'error',
      content: 'данные не получены',
    });
  };

  const fetchData = async () => {
    // loading();
    const url = `http://127.0.0.1:8000/api/users/`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        // setTimeout(messageApi.destroy, 100);
        const formattedData = response.data.map((item) => ({
          key: item.key,
          username: item.username,
          last_name: item.last_name,
          first_name: item.first_name,
          middle_name: item.middle_name,
          quest: item.quest.name,
          roles: item.roles.map((role) => role.name),
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.log(error);
      // errorF();
      // setTimeout(messageApi.destroy, 1000);
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

  const deleteBonusPenalty = async (key) => {
    const url = `http://127.0.0.1:8000/api/user/${key}`;
    try {
      const response = await axios.delete(url);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await postUser(value);
      if (response.status === 201) {
        messageApi.open({
          type: "success",
          content: "запись создана",
        });
      }
      fetchData();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не создана",
      });
    }
  };

  const [open, setOpen] = useState(
    localStorage.getItem("usersDrawerIsOpen")
      ? localStorage.getItem("usersDrawerIsOpen") === "true"
      : false
  );
  const [form] = Form.useForm();

  const [data, setData] = useState<DataType[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [optionsRoles, setOptionsRoles] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "сотрудники",
    },
  ];
  const columns = [
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps("username", "логину"),
      sorter: {
        compare: (a, b) => a.username - b.username,
      },
    },
    {
      title: "Фамилия",
      dataIndex: "last_name",
      key: "last_name",
      ...getColumnSearchProps("last_name", "фамилии"),
      sorter: {
        compare: (a, b) => a.last_name - b.last_name,
      },
    },
    {
      title: "Имя",
      dataIndex: "first_name",
      key: "first_name",
      ...getColumnSearchProps("first_name", "имени"),
      sorter: {
        compare: (a, b) => a.first_name - b.first_name,
      },
    },
    {
      title: "Отчество",
      dataIndex: "middle_name",
      key: "middle_name",
      ...getColumnSearchProps("middle_name", "отчеству"),
      sorter: {
        compare: (a, b) => a.middle_name - b.middle_name,
      },
    },
    {
      title: "Квест",
      dataIndex: "quest",
      key: "quest",
      ...getColumnSearchProps("quest", "квесту"),
      sorter: {
        compare: (a, b) => a.quest - b.quest,
      },
      render: (text) => (
        <Tag color="geekblue" style={{ textTransform: "lowercase" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Роли",
      dataIndex: "roles",
      key: "roles",
      // render: (_, { roles }) => (
      //   <>
      //     {roles.map((roles) => {
      //       return (
      //         <Tag color="geekblue" key={role}>
      //           {role.toLowerCase()}
      //         </Tag>
      //       );
      //     })}
      //   </>
      // ),
    },
    {
      title: "операция",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        data.length >= 1 ? (
          <Space>
            <Link to={`edit/${record.key}`}>редактировать</Link>
            <Popconfirm
              title="уверены, что хотите удалить?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>удалить</a>
            </Popconfirm>
          </Space>
        ) : null,
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
        <Title>сотрудники</Title>
        <Space size="middle">
          <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            новый сотрудник
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} bordered />
      <Drawer
        title="создать нового сотрудника"
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
                name="username"
                label="логин"
                rules={[
                  { required: true, message: "пожалуйста, введите логин" },
                ]}
              >
                <Input placeholder="пожалуйста, введите логин" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="пароль"
                rules={[
                  { required: true, message: "пожалуйста, введите пароль" },
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
      </Drawer>
    </Template>
  );
};

export default App;
