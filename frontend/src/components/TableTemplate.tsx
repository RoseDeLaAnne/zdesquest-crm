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
  FloatButton,
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
} from "@ant-design/icons";

// locale
// import 'dayjs/locale/ru-ru';
import locale from "antd/es/date-picker/locale/ru_RU";

// libs
import Highlighter from "react-highlight-words";

import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";

// components
import CSider from "../components/CSider";
import CBreadcrumb from "../components/CBreadcrumb";

import CTable from "../components/CTable";
import CDrawer from "../components/CDrawer";

dayjs.extend(customParseFormat);

// interface
import { IFC } from "../assets/utilities/interface";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

const App: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  title,
  datePicker,
  addEntry,
  addEntryTitle,
  questTables,
  fetchFunction,
  createFunction,
  deleteFunction,
  tableScroll,
  initialPackedTableColumns,
  tableColumnWithHead,
  tableOperation,
  tableBordered,
  drawerTitle,
  formItems,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { name } = useParams();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
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

  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("collapsed")
      ? localStorage.getItem("collapsed") === "true"
      : false
  );

  const [tableHead, setTableHead] = useState([]);
  const [tableDataSource, setTableDataSource] = useState([]);
  const tableOperationColumn = {
    title: "операция",
    dataIndex: "operation",
    key: "operation",
    render: (_, record: { key: React.Key }) =>
      tableDataSource.length >= 1 ? (
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
    fixed: "right",
  };
  let tableColumns = [];
  const initialUnpackedTableColumns = initialPackedTableColumns.map(
    (column) => {
      let newColumn = {
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.key,
      };

      if (column.sorting.isSorting && column.sorting.isDate) {
        newColumn.sorter = {
          compare: (a, b) => {
            const dateA = new Date(a.date.split(".").reverse().join("-"));
            const dateB = new Date(b.date.split(".").reverse().join("-"));
            return dateA - dateB;
          },
        };
      } else if (column.sorting.isSorting && !column.sorting.isDate) {
        newColumn.sorter = {
          compare: (a, b) => a[column.dataIndex] - b[column.dataIndex],
        };
      }

      if (column.width) {
        newColumn.width = column.width;
      }

      if (column.fixed) {
        newColumn.fixed = column.fixed;
      }

      if (column.filters && column.onFilter) {
        newColumn.filters = column.filters;
        newColumn.onFilter = column.onFilter;

        if (column.filterSearch) {
          newColumn.filterSearch = column.filterSearch;
        }
        if (column.filterMultiple) {
          newColumn.filterMultiple = column.filterMultiple;
        }
      }

      if (column.render) {
        newColumn.render = column.render;
      }

      if (column.searching.isSearching) {
        newColumn = {
          ...newColumn,
          ...getColumnSearchProps(column.dataIndex, column.searching.title),
        };
      }

      return newColumn;
    }
  );
  if (tableOperation) {
    tableColumns = [...initialUnpackedTableColumns, tableOperationColumn];
  } else {
    tableColumns = initialUnpackedTableColumns;
  }
  const countingFields = initialPackedTableColumns
    .filter((column) => column.countable)
    .map((column) => column.key);
  const fetchData = async (startDate, endDate) => {
    try {
      let response;
      if (questTables) {
        response = await fetchFunction(startDate, endDate, name);
      } else {
        response = await fetchFunction(startDate, endDate);
      }
      if (response.status === 200) {
        if (tableColumnWithHead) {
          setTableHead(response.data.head);
          setTableDataSource(response.data.body);
        } else {
          setTableDataSource(response.data);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // const newTableHead = [
  //   {
  //     title: "Максим",
  //     dataIndex: "admin",
  //     key: "admin",
  //     render: (text) => (
  //       <Tooltip
  //         title={<div dangerouslySetInnerHTML={{ __html: text.tooltip }} />}
  //         placement="topLeft"
  //       >
  //         <div>{text.sum}</div>
  //       </Tooltip>
  //     ),
  //   },
  //   {
  // title: "Sara",
  // dataIndex: "shaw",
  // key: "shaw",
  // render: (text) => (
  //   <Tooltip
  //     title={<div dangerouslySetInnerHTML={{ __html: text.tooltip }} />}
  //     placement="topLeft"
  //   >
  //     <div>{text.sum}</div>
  //   </Tooltip>
  // ),
  //   },
  // ];
  const newTableHead = tableHead.map((column) => {
    return {
      title: column.title,
      children: column.children.map((child) => {
        return {
          title: child.title,
          dataIndex: child.dataIndex,
          key: child.dataIndex,
          render: (text) => (
            <Tooltip
              title={<div dangerouslySetInnerHTML={{ __html: text.tooltip }} />}
              placement="topLeft"
            >
              <div>{text.sum}</div>
            </Tooltip>
          ),
        };
      }),
    };
  });

  console.log(newTableHead)
  if (tableColumnWithHead) {
    tableColumns = [
      ...initialUnpackedTableColumns,
      // ...tableHead,
      ...newTableHead,
      {
        title: "итого",
        dataIndex: "total",
        key: "total",
        sorting: {
          isSorting: true,
          isDate: false,
        },
        searching: {
          isSearching: true,
          title: "",
        },
        countable: true,
      },
    ];
  }
  const handleDelete = async (key: React.Key) => {
    const response = await deleteFunction(key);
    if (response.status === 200) {
      const newData = tableDataSource.filter((item) => item.key !== key);
      setTableDataSource(newData);
    }
  };

  const [formatDates, setFormatDates] = useState([]);
  const [dates, setDates] = useState([]);
  const handleDateChange = async (dates) => {
    setDates(dates);
    if (dates !== null) {
      fetchData(dates[0].format("DD-MM-YYYY"), dates[1].format("DD-MM-YYYY"));
    } else {
      fetchData(null, null);
    }
  };

  const [form] = Form.useForm();
  const formOnFinish = async (value: object) => {
    try {
      const response = await createFunction(value);
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

  const [drawerOpen, setDrawerOpen] = useState(
    localStorage.getItem("drawerIsOpen")
      ? localStorage.getItem("drawerIsOpen") === "true"
      : false
  );
  const drawerOnOpen = () => {
    setDrawerOpen(true);
    localStorage.setItem("drawerIsOpen", "true");
  };
  const drawerOnClose = () => {
    setDrawerOpen(false);
    localStorage.setItem("drawerIsOpen", "false");
  };

  const logout = async () => {
    console.log("logout");
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;
  };

  useEffect(() => {
    document.title = title;

    // const currentDate = new Date();
    // const currentDay = currentDate.getDate();
    // const currentMonth = currentDate.getMonth() + 1;

    // // 10.09.2023-25.09.2023 | 26.08.2023-09.09.2023

    // if (currentDay <= 9) {
    //   const currentYear = currentDate.getFullYear();
    //   const startDate = `26-${currentMonth - 1}-${currentYear}`;
    //   const endDate = `09-${currentMonth}-${currentYear}`;
    //   const formattedStartDate = formatDate(startDate); // "26-08-2023"
    //   const formattedEndDate = formatDate(endDate); // "09-09-2023"
    //   fetchData(formattedStartDate, formattedEndDate);
    // } else if (currentDay >= 10) {
    //   const currentYear = currentDate.getFullYear();
    //   const startDate = `10-${currentMonth}-${currentYear}`;
    //   const endDate = `25-${currentMonth}-${currentYear}`;
    //   const formattedStartDate = formatDate(startDate); // "26-08-2023"
    //   const formattedEndDate = formatDate(endDate); // "09-09-2023"
    //   fetchData(formattedStartDate, formattedEndDate);
    // } else {
    //   fetchData(null, null);
    // }

    fetchData(null, null);

    // if (currentDay >= 9 && currentDay <= 10) {
    //   // Replace month and year with the current values
    //   const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    //   const currentYear = currentDate.getFullYear();

    //   // Call the fetchData function with the updated dates
    //   const startDate = `${currentDay}.${currentMonth}.${currentYear}`;
    //   const endDate = `${currentDay}.${currentMonth}.${currentYear}`;
    //   fetchData(startDate, endDate);
    // }
  }, [name]);

  return (
    <Layout hasSider>
      <CSider
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
      />
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <CBreadcrumb items={breadcrumbItems} />

        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          <FloatButton onClick={() => logout()} />
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
              <Title>{title}</Title>
              <Space size="middle">
                {datePicker ? (
                  <RangePicker
                    onChange={handleDateChange}
                    // defaultValue={[
                    //   dayjs("26-08-2023", "DD.MM.YYYY"),
                    //   dayjs("09-09-2023", "DD.MM.YYYY"),
                    // ]}
                    format={"DD.MM.YYYY"}
                  />
                ) : (
                  ""
                )}
                {addEntry ? (
                  <Button
                    type="primary"
                    onClick={drawerOnOpen}
                    icon={<PlusOutlined />}
                  >
                    {addEntryTitle}
                  </Button>
                ) : (
                  ""
                )}
              </Space>
            </div>
            <CTable
              scroll={tableScroll}
              columns={tableColumns}
              dataSource={tableDataSource}
              countingFields={countingFields}
              bordered={tableBordered}
            />
            {addEntry ? (
              <CDrawer
                title={drawerTitle}
                onClose={drawerOnClose}
                open={drawerOpen}
                formItems={formItems}
                formForm={form}
                formOnFinish={formOnFinish}
              />
            ) : (
              ""
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
