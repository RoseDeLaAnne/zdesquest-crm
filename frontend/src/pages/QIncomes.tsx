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

  const [data, setData] = useState<DataType[]>([]);
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
      title: "доходы",
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
      title: "Дата/Время",
      dataIndex: "date",
      key: "date",
      width: 112,
    },
    {
      title: "Игра",
      dataIndex: "game",
      key: "game",
      ...getColumnSearchProps("game", "игре"),
      sorter: {
        compare: (a, b) => a.game - b.game,
      },
    },
    {
      title: "Комната",
      dataIndex: "room",
      key: "room",
      ...getColumnSearchProps("room", "комнате"),
      sorter: {
        compare: (a, b) => a.room - b.room,
      },
    },
    {
      title: "Видео",
      dataIndex: "video",
      key: "video",
      ...getColumnSearchProps("video", "видео"),
      sorter: {
        compare: (a, b) => a.video - b.video,
      },
    },
    {
      title: "Фотомагниты",
      dataIndex: "photomagnets",
      key: "photomagnets",
      ...getColumnSearchProps("photomagnets", "фотомагнитам"),
      sorter: {
        compare: (a, b) => a.photomagnets - b.photomagnets,
      },
    },
    {
      title: "Актер",
      dataIndex: "actor",
      key: "actor",
      ...getColumnSearchProps("actor", "актеру"),
      sorter: {
        compare: (a, b) => a.actor - b.actor,
      },
    },
    {
      title: "Итог",
      dataIndex: "total",
      key: "total",
      ...getColumnSearchProps("rate", "ставке"),
      sorter: {
        compare: (a, b) => a.rate - b.rate,
      },
    },
  ];

  useEffect(() => {
    fetchData(null, null);
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["quests", "questsRainbow"]}
      defaultSelectedKeys={["questsRainbowIncomes"]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>радуга | доходы</Title>
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

          let totalGame = 0;
          let totalRoom = 0;
          let totalVideo = 0;
          let totalPhotomagnets = 0;
          let totalActor = 0;
          let totalTotal = 0;

          data.forEach(({ game, room, video, photomagnets, actor, total }) => {
            totalGame += game;
            totalRoom += room;
            totalVideo += video;
            totalPhotomagnets += photomagnets;
            totalActor += actor;
            totalTotal += total;
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>{totalGame}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text>{totalRoom}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{totalVideo}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{totalPhotomagnets}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{totalActor}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text>{totalTotal}</Text>
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
