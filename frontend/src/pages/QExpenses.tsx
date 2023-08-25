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
import { getQuestIncomes } from "../api/APIUtils";

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
    const response = await getQuestIncomes(qname, startDate, endDate);
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
      key: 1,
      date: "10.07.2023",
      topKvestov: 1200,
      mirKvestov: 1000,
      questHunter: 500,
      instagram: 500,
      vkontakte: 500,
      site: 500,
      stavka: 2900,
      comunalka: 1200,
      manager: 500,
      administrator: 500,
      actor: 500,
      other: 5000,
      total: 5000,
    },
    {
      key: 2,
      date: "11.07.2023",
      topKvestov: 2900,
      mirKvestov: 2900,
      questHunter: 2900,
      instagram: 500,
      vkontakte: 500,
      site: 500,
      stavka: 2900,
      comunalka: 1200,
      manager: 500,
      administrator: 500,
      actor: 500,
      other: 5000,
      total: 5000,
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
      title: "расходы",
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
        compare: (a, b) => {
          const dateA = new Date(a.date.split(".").reverse().join("-"));
          const dateB = new Date(b.date.split(".").reverse().join("-"));
          return dateA - dateB;
        },
      },
      width: 112,
      fixed: "left",
    },
    {
      title: "Агрегаторы",
      children: [
        {
          title: "top kvestov",
          dataIndex: "topKvestov",
          key: "topKvestov",
          ...getColumnSearchProps("topKvestov", "topKvestov"),
          sorter: {
            compare: (a, b) => a.topKvestov - b.topKvestov,
          },
        },
        {
          title: "mir-kvestov",
          dataIndex: "mirKvestov",
          key: "mirKvestov",
          ...getColumnSearchProps("mirKvestov", "mirKvestov"),
          sorter: {
            compare: (a, b) => a.mirKvestov - b.mirKvestov,
          },
        },
        {
          title: "quest hunter",
          dataIndex: "questHunter",
          key: "questHunter",
          ...getColumnSearchProps("questHunter", "questHunter"),
          sorter: {
            compare: (a, b) => a.questHunter - b.questHunter,
          },
        },
      ],
    },
    {
      title: "реклама",
      children: [
        {
          title: "instagram",
          dataIndex: "instagram",
          key: "instagram",
          ...getColumnSearchProps("instagram", "instagram"),
          sorter: {
            compare: (a, b) => a.instagram - b.instagram,
          },
        },
        {
          title: "вконтакте",
          dataIndex: "vkontakte",
          key: "vkontakte",
          ...getColumnSearchProps("vkontakte", "vkontakte"),
          sorter: {
            compare: (a, b) => a.vkontakte - b.vkontakte,
          },
        },
        {
          title: "сайт",
          dataIndex: "site",
          key: "site",
          ...getColumnSearchProps("site", "site"),
          sorter: {
            compare: (a, b) => a.site - b.site,
          },
        },
      ],
    },
    {
      title: "Аренда",
      children: [
        {
          title: "Ставка",
          dataIndex: "stavka",
          key: "stavka",
          ...getColumnSearchProps("stavka", "stavka"),
          sorter: {
            compare: (a, b) => a.stavka - b.stavka,
          },
        },
        {
          title: "Коммуналка",
          dataIndex: "comunalka",
          key: "comunalka",
          ...getColumnSearchProps("comunalka", "comunalka"),
          sorter: {
            compare: (a, b) => a.comunalka - b.comunalka,
          },
        },
      ],
    },
    {
      title: "зарплата",
      children: [
        {
          title: "управляющий",
          dataIndex: "manager",
          key: "manager",
          ...getColumnSearchProps("manager", "manager"),
          sorter: {
            compare: (a, b) => a.manager - b.manager,
          },
        },
        {
          title: "администратор",
          dataIndex: "administrator",
          key: "administrator",
          ...getColumnSearchProps("administrator", "administrator"),
          sorter: {
            compare: (a, b) => a.administrator - b.administrator,
          },
        },
        {
          title: "актер",
          dataIndex: "actor",
          key: "actor",
          ...getColumnSearchProps("actor", "actor"),
          sorter: {
            compare: (a, b) => a.actor - b.actor,
          },
        },
      ],
    },
    {
      title: "Прочие расходы",
      dataIndex: "other",
      key: "other",
      ...getColumnSearchProps("other", "other"),
      sorter: {
        compare: (a, b) => a.other - b.other,
      },
    },
    {
      title: "итого",
      dataIndex: "total",
      key: "total",
      ...getColumnSearchProps("total", "total"),
      sorter: {
        compare: (a, b) => a.total - b.total,
      },
      width: 128,
      fixed: "right",
    },
  ];

  useEffect(() => {
    // fetchData(null, null);
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["quests", "questsRainbow"]}
      defaultSelectedKeys={["questsRainbowExpenses"]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>радуга | расходы</Title>
        <RangePicker onChange={handleDateChange} />
      </div>
      <Table
        scroll={{ x: 2500 }}
        columns={columns}
        dataSource={data}
        bordered
        summary={() => {
          if (data.length === 0) {
            return null;
          }

          let ttopKvestov = 0;
          let tmirKvestov = 0;
          let tquestHunter = 0;
          let tinstagram = 0;
          let tvkontakte = 0;
          let tsite = 0;
          let tstavka = 0;
          let tcomunalka = 0;
          let tmanager = 0;
          let tadministrator = 0;
          let tactor = 0;
          let tother = 0;
          let ttotal = 0;

          data.forEach(
            ({
              topKvestov,
              mirKvestov,
              questHunter,
              instagram,
              vkontakte,
              site,
              stavka,
              comunalka,
              manager,
              administrator,
              actor,
              other,
              total,
            }) => {
              ttopKvestov += topKvestov;
              tmirKvestov += mirKvestov;
              tquestHunter += questHunter;
              tinstagram += instagram;
              tvkontakte += vkontakte;
              tsite += site;
              tstavka += stavka;
              tcomunalka += comunalka;
              tmanager += manager;
              tadministrator += administrator;
              tactor += actor;
              tother += other;
              ttotal += total;
            }
          );

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>{ttopKvestov}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text>{tmirKvestov}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{tquestHunter}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{tinstagram}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{tvkontakte}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text>{tsite}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <Text>{tstavka}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <Text>{tcomunalka}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  <Text>{tmanager}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  <Text>{tadministrator}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11}>
                  <Text>{tactor}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12}>
                  <Text>{tother}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={13}>
                  <Text>{ttotal}</Text>
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
