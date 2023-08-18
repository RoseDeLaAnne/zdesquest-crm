import React, { FC, ReactNode, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Skeleton,
  Layout,
  Typography,
  Form,
  Button,
  Result,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import axios from "axios";

import SideBar from "../components/SideBar";
import CustomBreadcrumb from "../components/Breadcrumb";
import Main from "../components/Main";

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;

type MenuItem = Required<MenuProps>["items"][number];

interface MainProps {
  children: ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  to: string, // Add the 'to' prop for the link
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    // Wrap the label in a Link component
    label: <Link to={to}>{label}</Link>,
    type,
  } as MenuItem;
}

const sideBarItems: MenuItem[] = [
  getItem("Пользователи", "users", "/users", <UserOutlined />),

  getItem("Квесты", "quests", "/quests", <QuestionOutlined />, [
    getItem("Радуга", "sub3", "/quests", <QuestionOutlined />, [
      getItem("Доходы", "11", "/quests", <RiseOutlined />),
      getItem("Расходы", "12", "/quests", <FallOutlined />),
      getItem("Зарплаты", "13", "/quests", <DollarOutlined />),
    ]),
    getItem("Добавить", "questsAdd", "/quests/add", <AppstoreAddOutlined />),
  ]),
];

const breadCrumbItems = [
  {
    text: "Главная",
    link: `/`,
  },
  {
    text: "Квесты",
    link: `/quests`,
  },
  {
    text: "Радуга",
    link: `/quests/3`,
  },
  {
    text: "Доходы",
    link: "",
  },
];

interface DataType {
  key: React.ReactNode;
  dateTime: string;
  time: string;
  game: number;
  room: number;
  video: number;
  photomagnets: number;
  actor: number;
  total: number;
  children?: DataType[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Дата/Время",
    dataIndex: "dateTime",
    key: "dateTime",
  },
  {
    title: "Игра",
    dataIndex: "game",
    key: "game",
  },
  {
    title: "Комната",
    dataIndex: "room",
    key: "room",
  },
  {
    title: "Видео",
    dataIndex: "video",
    key: "video",
  },
  {
    title: "Фотомагниты",
    dataIndex: "photomagnets",
    key: "photomagnets",
  },
  {
    title: "Актер",
    dataIndex: "actor",
    key: "actor",
  },
  {
    title: "Итог",
    dataIndex: "total",
    key: "total",
  },
];

// rowSelection objects indicates the need for row selection
const rowSelection: TableRowSelection<DataType> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const App: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const checkStrictly = false;

  const { id } = useParams();

  const [data, setData] = useState<DataType[]>([]);

  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  async function fetchData(startDate, endDate) {
    try {
      var response;

      if (startDate !== null && endDate !== null) {
        response = await axios.get<DataType[]>(
          `http://127.0.0.1:8000/api/incomes/${id}/?start_date=${startDate}&end_date=${endDate}`
        );
      } else {
        response = await axios.get<DataType[]>(
          `http://127.0.0.1:8000/api/incomes/${id}`
        );
      }

      setData(response.data); // Set fetched data to the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    document.title = "радуга | доходы";

    fetchData(null, null); // Call the async function
  }, []); // Empty dependency array to run the effect only once

  const handleDateChange = async (dates) => {
    if (dates !== null) {
      fetchData(dates[0].format("DD-MM-YYYY"), dates[1].format("DD-MM-YYYY"));
    } else {
      fetchData(null, null);
    }
  };

  return (
    <Layout hasSider>
      <SideBar items={sideBarItems} />
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <CustomBreadcrumb items={breadCrumbItems} />
        <Main>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title style={{ textTransform: "lowercase" }}>Доходы</Title>
            <RangePicker onChange={handleDateChange} />
          </div>

          <Table
            columns={columns}
            bordered
            rowSelection={{ ...rowSelection, checkStrictly }}
            dataSource={data}
            summary={() => {
              if (data.length === 0) {
                return null; // No data, so don't show the summary row
              }

              let totalGame = 0;
              let totalRoom = 0;
              let totalVideo = 0;
              let totalPhotomagnets = 0;
              let totalActor = 0;
              let totalTotal = 0;

              data.forEach(
                ({ game, room, video, photomagnets, actor, total }) => {
                  totalGame += game;
                  totalRoom += room;
                  totalVideo += video;
                  totalPhotomagnets += photomagnets;
                  totalActor += actor;
                  totalTotal += total;
                }
              );

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>итого</Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text>{totalGame}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text>{totalRoom}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <Text>{totalVideo}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <Text>{totalPhotomagnets}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <Text>{totalActor}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                      <Text>{totalTotal}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </Main>
      </Layout>
    </Layout>
  );
};

export default App;
