import React, { FC, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import type { MenuProps } from "antd";
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
import type { InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type {
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
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
import axios from "axios";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type MenuItem = Required<MenuProps>["items"][number];

interface DataType {
  key: string;
  date: string;
  amountOfExpense: number;
  expenseName: string;
  quests: string[];
}

type DataIndex = keyof DataType;

const App: FC = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("collapsed")
      ? localStorage.getItem("collapsed") === "true"
      : false
  );
  const [open, setOpen] = useState(
    localStorage.getItem("expensesDrawerIsOpen")
      ? localStorage.getItem("expensesDrawerIsOpen") === "true"
      : false
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<DataType[]>([
    {
      key: "1",
      date: "03.06.2023",
      amountOfExpense: 100,
      expenseName: "Наименование расхода 3",
      quests: ["Они", "Радуга"],
    },
    {
      key: "2",
      date: "04.06.2023",
      amountOfExpense: 200,
      expenseName: "Наименование расхода 4",
      quests: ["Радуга"],
    },
    {
      key: "3",
      date: "01.06.2023",
      amountOfExpense: 300,
      expenseName: "Наименование расхода 1",
      quests: ["Они", "Радуга"],
    },
    {
      key: "4",
      date: "02.06.2023",
      amountOfExpense: 400,
      expenseName: "Наименование расхода 2",
      quests: ["Они", "Радуга"],
    },
  ]);
  const [quests, setQuests] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  const handleDelete = (key: React.Key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
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

  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date", "дате"),
      defaultSortOrder: "ascend",
      sorter: {
        compare: (a, b) => {
          const dateA = new Date(a.date.split(".").reverse().join("-"));
          const dateB = new Date(b.date.split(".").reverse().join("-"));
          return dateA - dateB;
        },
      },
    },
    {
      title: "Сумма расхода",
      dataIndex: "amountOfExpense",
      key: "amountOfExpense",
      ...getColumnSearchProps("amountOfExpense", "сумме расхода"),
      sorter: {
        compare: (a, b) => a.amountOfExpense - b.amountOfExpense,
      },
    },
    {
      title: "Наименование расхода",
      dataIndex: "expenseName",
      key: "expenseName",
      ...getColumnSearchProps("expenseName", "наименованию расхода"),
      sorter: {
        compare: (a, b) => a.expenseName - b.expenseName,
      },
    },
    {
      title: "Квесты",
      dataIndex: "quests",
      key: "quests",
      render: (_, { quests }) => (
        <>
          {quests.map((quest) => {
            return (
              <Tag color={"geekblue"} key={quest}>
                {quest.toLowerCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "операция",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        data.length >= 1 ? (
          <Space size="middle">
            <Popconfirm
              title="уверены, что нужно удалить?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>удалить</a>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    to: string,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: (
        <Link to={to} className="menu__link">
          {label}
        </Link>
      ),
      type,
    } as MenuItem;
  }

  const menuItems: MenuItem[] = [
    getItem("Пользователи", "users", "/users", <UserOutlined />),
    getItem(
      "Исх. таблицы",
      "sourceTables",
      "/source-tables",
      <TableOutlined />,
      [
        getItem(
          "Расходы",
          "sourceTablesExpenses",
          "/source-tables/expenses",
          <FallOutlined />
        ),
      ]
    ),

    getItem("Квесты", "quests", "/quests", <QuestionOutlined />, [
      getItem("Радуга", "sub3", "/quests", <QuestionOutlined />, [
        getItem("Доходы", "11", "/quests", <RiseOutlined />),
        getItem("Расходы", "12", "/quests", <FallOutlined />),
        getItem("Зарплаты", "13", "/quests", <DollarOutlined />),
      ]),
      getItem("Добавить", "questsAdd", "/quests/add", <AppstoreAddOutlined />),
    ]),
  ];

  const breadcrumbSubItems = [
    {
      key: "1",
      label: (
        <Link to="/">
          <HomeOutlined />
          <span style={{ marginLeft: "8px", textTransform: "lowercase" }}>
            Исходные таблицы
          </span>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/">
          <HomeOutlined />
          <span style={{ marginLeft: "8px", textTransform: "lowercase" }}>
            Исходные таблицы
          </span>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to="/">
          <HomeOutlined />
          <span style={{ marginLeft: "8px", textTransform: "lowercase" }}>
            Исходные таблицы
          </span>
        </Link>
      ),
    },
  ];
  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
          <span style={{ marginLeft: "8px" }}>Главная</span>
        </Link>
      ),
    },
    {
      title: (
        <Link to="/source-tables">
          <TableOutlined />
          <span style={{ marginLeft: "8px" }}>Исходные таблицы</span>
        </Link>
      ),
    },
    {
      title: (
        <>
          <FallOutlined />
          <span style={{ marginLeft: "8px" }}>Расходы</span>
        </>
      ),
      menu: { items: breadcrumbSubItems },
    },
  ];

  const showDrawer = () => {
    setOpen(true);
    localStorage.setItem("expensesDrawerIsOpen", "true");
  };

  const onClose = () => {
    setOpen(false);
    localStorage.setItem("expensesDrawerIsOpen", "false");
  };

  const fetchData = async () => {
    const url = `http://127.0.0.1:8000/api/expenses-table/`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const formattedData = response.data.map((item) => ({
          key: item.key,
          date: item.date,
          amountOfExpense: item.amount_of_expense,
          expenseName: item.expense_name,
          quests: item.quests.map((quest) => quest.quest_name),
        }));
        setData(formattedData);
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
        setQuests(response.data);
        const formattedOptions = response.data.map((item) => ({
          label: item.quest_name.toLowerCase(),
          value: item.id,
        }));
        setOptionsQuests(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    const url = `http://127.0.0.1:8000/api/expenses-form/`;
    try {
      const response = await axios.post(url, value);
      if (response.status === 200) {
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

  useEffect(() => {
    document.title = "исходные таблицы | расходы";

    fetchData();
    fetchQuests();
  }, []);

  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => {
          setCollapsed(value);
          localStorage.setItem("collapsed", value.toString());
        }}
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
          defaultOpenKeys={["sourceTables"]}
          defaultSelectedKeys={["sourceTablesExpenses"]}
          mode="inline"
          items={menuItems}
          className="menu"
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <Breadcrumb items={breadcrumbItems} style={{ margin: "24px 16px 0" }} />

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
              <Title className="title">Расходы</Title>
              <Button
                type="primary"
                onClick={showDrawer}
                icon={<PlusOutlined />}
              >
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

                let totalAmountOfExpense = 0;

                data.forEach(({ amountOfExpense }) => {
                  totalAmountOfExpense += amountOfExpense;
                });

                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text>{totalAmountOfExpense}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
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
                  <Col span={24}>
                    <Form.Item
                      name="date"
                      label="дата"
                      rules={[
                        { required: true, message: "пожалуйста, введите дату" },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="amountOfExpense"
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
                      name="expenseName"
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
            </Drawer>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
