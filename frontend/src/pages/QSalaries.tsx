import React, { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

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
  Tooltip,
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
import { getQuestExpenses } from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

const App: FC = () => {
  const { qname } = useParams();

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

  const fetchData = async (startDate, endDate) => {
    const response = await getQuestExpenses(qname, startDate, endDate);
    if (response.status === 200) {
      setData(response.data);
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

  const [data, setData] = useState([
    {
      key: "1",
      date: "01.06.2023",
      gregory: {
        value: 2000,
        tooltip:
          "1) 500р. - 1 игра<br />2) 100р. - 1 видео<br />3) 50р. - проезд",
      },
      yulia: {
        value: 1000,
        tooltip:
          "1) 1000р. - 2 игры<br />2) 100р. - 1 видео<br />3) 50р. - проезд",
      },
    },
  ]);
  const [dates, setDates] = useState([]);
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
      icon: FallOutlined,
      title: "радуга",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "квартира 404",
          to: "/quests/room-404",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "радуга",
          to: "/quests/rainbow",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "тьма",
          to: "/quests/dark",
        },
      ],
    },
    {
      icon: FallOutlined,
      title: "зарплаты",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "доходы",
          to: "/quests/rainbow/incomes",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/quests/rainbow/expenses",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "зарплаты",
          to: "/quests/rainbow/salaries",
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
        compare: (a, b) => a.date - b.date,
      },
      width: 112,
    },
    {
      title: "Григорий",
      dataIndex: "gregory",
      key: "gregory",
      ...getColumnSearchProps("gregory", "значению"),
      sorter: {
        compare: (a, b) => a.gregory - b.gregory,
      },
      render: (gregory) => (
        <Tooltip
          title={<div dangerouslySetInnerHTML={{ __html: gregory.tooltip }} />}
          placement="topLeft"
        >
          <div>{gregory.value}</div>
        </Tooltip>
      ),
    },
    {
      title: "Юлия",
      dataIndex: "yulia",
      key: "yulia",
      ...getColumnSearchProps("yulia", "значению"),
      sorter: {
        compare: (a, b) => a.yulia - b.yulia,
      },
      render: (yulia) => (
        <Tooltip
          title={<div dangerouslySetInnerHTML={{ __html: yulia.tooltip }} />}
          placement="topLeft"
        >
          <div>{yulia.value}</div>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    // fetchData(null, null);
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["quests", "questsRainbow"]}
      defaultSelectedKeys={["questsRainbowSalaries"]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>радуга | зарплаты</Title>
        <RangePicker onChange={handleDateChange} />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        summary={() => {
          if (data.length === 0) {
            return null;
          }

          let totalGregory = 0;
          let totalYulia = 0;

          data.forEach(({ gregory, yulia }) => {
            totalGregory += gregory.value;
            totalYulia += yulia.value;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>{totalGregory}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text>{totalYulia}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </Template>
  );
};

export default App;
