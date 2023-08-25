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
import { deleteSTExpense, getQuests, getSTExpenses, postSTExpense } from "../api/APIUtils";

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
    const response = await deleteExpense(key);
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
    localStorage.setItem("expensesDrawerIsOpen", "true");
  };

  const onClose = () => {
    setOpen(false);
    localStorage.setItem("expensesDrawerIsOpen", "false");
  };

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await getSTExpenses(startDate, endDate);
      if (response.status === 200) {
        const formattedData = response.data.map((item) => ({
          key: item.key,
          date: item.date,
          amount: item.amount,
          name: item.name,
          subCategory: item.sub_category.name,
          quests: item.quests.map((quest) => quest.name),
        }));
        setData(formattedData);
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

  const fetchExpenseSubCategories = async () => {
    const url = `http://127.0.0.1:8000/api/expense-sub-categories/`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        // setCategories(response.data);
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

  const deleteExpense = async (key) => {
    try {
      const response = await deleteSTExpense(key);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = async (dates) => {
    setDates(dates);
    if (dates !== null) {
      fetchData(dates[0].format("DD-MM-YYYY"), dates[1].format("DD-MM-YYYY"));
    } else {
      fetchData(null, null);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await postSTExpense(value);
      if (response.status === 201) {
        messageApi.open({
          type: "success",
          content: "запись создана",
        });
        // setData((prevData) => [...prevData, value])
        if (dates.length !== 0) {
          fetchData(
            dates[0].format("DD-MM-YYYY"),
            dates[1].format("DD-MM-YYYY")
          );
        } else {
          fetchData(null, null);
        }
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не создана",
      });
    }
  };

  const [open, setOpen] = useState(
    localStorage.getItem("expensesDrawerIsOpen")
      ? localStorage.getItem("expensesDrawerIsOpen") === "true"
      : false
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<DataType[]>([]);
  const [dates, setDates] = useState([]);
  const [quests, setQuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [optionsSubCategories, setOptionsSubCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
    },
  ];
  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date", "дате"),
      sorter: {
        compare: (a, b) => {
          const dateA = new Date(a.date.split(".").reverse().join("-"));
          const dateB = new Date(b.date.split(".").reverse().join("-"));
          return dateA - dateB;
        },
      },
      width: 112,
    },
    {
      title: "Сумма расхода",
      dataIndex: "amount",
      key: "amount",
      ...getColumnSearchProps("amount", "сумме расхода"),
      sorter: {
        compare: (a, b) => a.amount - b.amount,
      },
    },
    {
      title: "Наименование расхода",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name", "наименованию расхода"),
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: "Подкатегория",
      dataIndex: "subCategory",
      key: "subCategory",
      filters: [
        {
          text: "instagram",
          value: "Instagram",
        },
        {
          text: "вконтакте",
          value: "ВКонтакте",
        },
      ],
      onFilter: (value: string, record) => record.subCategory.startsWith(value),
      filterSearch: true,
      render: (text) => (
        <Tag color="geekblue" style={{ textTransform: "lowercase" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Квесты",
      dataIndex: "quests",
      key: "quests",
      render: (_, { quests }) => (
        <>
          {quests.map((quest) => {
            return (
              <Tag color="geekblue" key={quest}>
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
      width: 192,
    },
  ];

  useEffect(() => {
    fetchData(null, null);
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
        <Title>исходные таблицы | расходы</Title>
        <Space size="middle">
          <RangePicker onChange={handleDateChange} />
          <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            новая запись
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        summary={() => {
          if (data.length === 0) {
            return null;
          }

          let totalAmount = 0;

          data.forEach(({ amount }) => {
            totalAmount += amount;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>{totalAmount}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
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
      </Drawer>
    </Template>
  );
};

export default App;
