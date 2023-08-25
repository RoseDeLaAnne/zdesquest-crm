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
  Badge,
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
import {
  deleteTransaction,
  getTransactions,
  postTransaction,
} from "../api/APIUtils";

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
    const response = await deleteTransaction(key);
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
    localStorage.setItem("transactionsDrawerIsOpen", "true");
  };

  const onClose = () => {
    setOpen(false);
    localStorage.setItem("transactionsDrawerIsOpen", "false");
  };

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await getTransactions(startDate, endDate);
      if (response.status === 200) {
        const formattedData = response.data.map((item) => ({
          key: item.key,
          date: item.date,
          amount: item.amount,
          status: item.status,
        }));
        setData(formattedData);
      }
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
      const response = await postTransaction(value);
      if (response.status === 201) {
        messageApi.open({
          type: "success",
          content: "запись создана",
        });
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
    localStorage.getItem("transactionsDrawerIsOpen")
      ? localStorage.getItem("transactionsDrawerIsOpen") === "true"
      : false
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<DataType[]>([]);
  const [dates, setDates] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
      title: "Статус",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "в ожидании",
          value: "processing",
        },
        {
          text: "одобрена",
          value: "success",
        },
        {
          text: "отклонена",
          value: "error",
        },
      ],
      onFilter: (value: string, record) => record.status.startsWith(value),
      filterSearch: true,
      render: (status) => (
        <Badge
          status={status}
          text={
            status === "processing"
              ? "в ожидании"
              : status === "success"
              ? "одобрена"
              : "отклонена"
          }
        />
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
    },
  ];

  useEffect(() => {
    fetchData(null, null);
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
        <Title>транзакции</Title>
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
        </Form>
      </Drawer>
    </Template>
  );
};

export default App;
