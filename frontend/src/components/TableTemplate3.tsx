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

// components
import CSider from "../components/CSider";
import CBreadcrumb from "../components/CBreadcrumb";

import CTable from "../components/CTable";
import CDrawer from "../components/CDrawer";

// interface
import { IFC } from "../assets/utilities/interface";

import { dateFormat } from "../constants/dateFormat";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

const App: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  title,
  isDatePicker,
  fetchFunction,
  isUseParams,
  initialPackedTableDataColumn,
  initialPackedTableColumns,
  tableScroll,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { name } = isUseParams ? useParams() : { name: "" };

  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("collapsed")
      ? localStorage.getItem("collapsed") === "true"
      : false
  );

  const [dates, setDates] = useState([]);
  const [tableDataSource, setTableDataSource] = useState([]);

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

  const fetchData = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    try {
      const response = isUseParams
        ? await fetchFunction(startDate, endDate, name)
        : await fetchFunction(startDate, endDate);

      if (response.status === 200) {
        setTableDataSource(response.data);
      }
    } catch (error) {
      throw error;
    }
  };
  const handleDateChange = async (dates: any) => {
    const [startDate, endDate] = dates || [null, null];
    const startDateStr = startDate ? startDate.format("DD-MM-YYYY") : null;
    const endDateStr = endDate ? endDate.format("DD-MM-YYYY") : null;

    setDates(dates);

    fetchData(startDateStr, endDateStr);
  };

  let initialUnPackedTableDataColumn = {
    title: initialPackedTableDataColumn.title,
    dataIndex: initialPackedTableDataColumn.dataIndex,
    key: initialPackedTableDataColumn.key,
    width: initialPackedTableDataColumn.width,
  };

  if (initialPackedTableDataColumn.isSorting) {
    initialUnPackedTableDataColumn.sorter = {
      compare: (a, b) => {
        const dateA = new Date(a.date.split(".").reverse().join("-"));
        const dateB = new Date(b.date.split(".").reverse().join("-"));
        return dateA - dateB;
      },
    };
  }

  if (initialPackedTableDataColumn.fixed) {
    initialUnPackedTableDataColumn.fixed = initialPackedTableDataColumn.fixed;
  }

  if (initialPackedTableDataColumn.searching.isSearching) {
    initialUnPackedTableDataColumn = {
      ...initialUnPackedTableDataColumn,
      ...getColumnSearchProps(
        initialPackedTableDataColumn.dataIndex,
        initialPackedTableDataColumn.searching.title
      ),
    };
  }

  const initialTableColumns = initialPackedTableColumns.map((column) => {
    let newColumn = {
      title: column.title,
      dataIndex: column.dataIndex,
      key: column.key,
    };

    if (column.isSorting) {
      newColumn.sorter = {
        compare: (a, b) => a[column.dataIndex] - b[column.dataIndex],
      };
    }

    if (column.searching.isSearching) {
      newColumn = {
        ...newColumn,
        ...getColumnSearchProps(column.dataIndex, column.searching.title),
      };
    }

    if (column.render) {
      newColumn.render = column.render;
    }

    return newColumn;
  });

  const tableColumns = [initialUnPackedTableDataColumn, ...initialTableColumns];
  const countingFields = initialPackedTableColumns
    .filter((column) => column.countable)
    .map((column) => column.key);

  useEffect(() => {
    document.title = title;

    fetchData(null, null);
  }, []);

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
              {isDatePicker && (
                <RangePicker onChange={handleDateChange} format={dateFormat} />
              )}
            </div>
            <CTable
              scroll={tableScroll}
              columns={tableColumns}
              dataSource={tableDataSource}
              countingFields={countingFields}
              isObj={false}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
