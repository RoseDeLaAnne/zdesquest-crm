// libs
import Highlighter from "react-highlight-words";

import { FC, useRef, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import {
  Space,
  Form,
  Button,
  Input,
  Popconfirm,
  FloatButton,
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
import { SearchOutlined } from "@ant-design/icons";

// components
import CMain from "./Main";
import CTable from "../UI/Table";
import CDrawer from "../UI/Drawer";

import { localStorageRemoveItem } from "../../assets/utilities/jwt";

import { useAuth } from "../../provider/authProdiver";

const TableFC: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  isRangePicker,
  addEntryTitle,
  isCancel,
  isCreate,
  tableScroll,
  tableDateColumn,
  initialPackedTableColumns,
  tableIsOperation,
  getFunction,
  deleteFunction,
  postFunction,
  isUseParams,
  isAddEntry,
  drawerTitle,
  formItems,
  notVisibleFormItems,
  defaultValuesFormItems,
  formHandleOnChange,
}) => {
  const { id } = isUseParams ? useParams() : { id: "" };

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

  const [drawerIsOpen, setDrawerIsOpen] = useState(
    localStorage.getItem("drawerIsOpen")
      ? localStorage.getItem("drawerIsOpen") === "true"
      : false
  );

  let title = "";
  const breadcrumbItemsLength = breadcrumbItems.length;
  if (breadcrumbItemsLength !== 1) {
    if (isCancel === false && isCreate === false) {
      title = `${breadcrumbItems[breadcrumbItems.length - 2].title} | ${
        breadcrumbItems[breadcrumbItems.length - 1].title
      }`;
    } else if (isCancel === true && isCreate === true) {
      title = `${
        breadcrumbItems[breadcrumbItems.length - 1].title
      } | редактирование`;
    }
  } else if (breadcrumbItemsLength === 1) {
    title = breadcrumbItems[0].title;
  }

  const drawerOnClose = () => {
    setDrawerIsOpen(false);
    localStorage.setItem("drawerIsOpen", "false");
  };
  const addEntryHandleClick = () => {
    setDrawerIsOpen(true);
    localStorage.setItem("drawerIsOpen", "true");
  };
  const cancelHandleClick = () => {};

  // const handleToggle = async (key: number) => {};
  const handleDelete = async (key: number) => {
    const res = await deleteFunction(key);
    if (res.status === 200) {
      const newData = tableDataSource.filter((item) => item.key !== key);
      setTableDataSource(newData);

      if (dates.length !== 0) {
        getEntries(
          dates[0].format("DD-MM-YYYY"),
          dates[1].format("DD-MM-YYYY")
        );
      } else {
        getEntries(null, null);
      }
    }
  };

  const [dates, setDates] = useState([]);
  const [tableDataHead, setTableDataHead] = useState([]);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [form] = Form.useForm();

  let tableColumns = [];
  let initialUnpackedTableDateColumn = {};
  let unpackedTableColumns = [];
  let tableCountingFields = [];
  if (tableDateColumn === "date") {
    initialUnpackedTableDateColumn = {
      title: "дата",
      dataIndex: tableDateColumn,
      key: tableDateColumn,
      width: 112,
      sorter: (a, b) => {
        const dateA = new Date(a.date.split(".").reverse().join("-"));
        const dateB = new Date(b.date.split(".").reverse().join("-"));
        return dateA - dateB;
      },
      ...getColumnSearchProps("date", "дате"),
      fixed: "left",
    };
  } else if (tableDateColumn === "date_time") {
    initialUnpackedTableDateColumn = {
      title: "дата/время",
      dataIndex: tableDateColumn,
      key: tableDateColumn,
      width: 140,
      ...getColumnSearchProps("date_time", "дате/времени"),
      fixed: "left",
    };
  }
  if (initialPackedTableColumns) {
    unpackedTableColumns = initialPackedTableColumns.map((column) => {
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
    tableCountingFields = initialPackedTableColumns
      .filter((column) => column.isCountable)
      .map((column) => column.key);
  }
  if (tableDateColumn) {
    tableColumns = [
      // {
      //   title: "id",
      //   dataIndex: "id",
      //   key: "id",
      //   ...getColumnSearchProps("id", "id"),
      //   render: (_, record: { key: React.Key }) =>
      //     tableDataSource.length >= 1 ? (
      //       <Link to={`edit/${record.key}`}>{record.key}</Link>
      //     ) : null,
      //   width: 64,
      //   fixed: "left",
      // },
      initialUnpackedTableDateColumn,
      ...unpackedTableColumns,
    ];
  } else {
    tableColumns = [
      // {
      //   title: "id",
      //   dataIndex: "id",
      //   key: "id",
      //   ...getColumnSearchProps("id", "id"),
      //   render: (_, record: { key: React.Key }) =>
      //     tableDataSource.length >= 1 ? (
      //       <Link to={`edit/${record.key}`}>{record.key}</Link>
      //     ) : null,
      //   width: 64,
      //   fixed: "left",
      // },
      ...unpackedTableColumns,
    ];
  }
  if (tableIsOperation === true) {
    tableColumns = [
      ...tableColumns,
      {
        // title: "операция",
        // dataIndex: "operation",
        // key: "operation",
        // render: (_, record: { key: React.Key }) =>
        //   tableDataSource.length >= 1 ? (
        //     <Space>
        //       <Popconfirm
        //         title="toggle"
        //         onConfirm={() => handleToggle(record.key)}
        //       >
        //         <a>toggle</a>
        //       </Popconfirm>
        //     </Space>
        //   ) : null,
        // width: 192,
        // fixed: "right",
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
      },
    ];
  }
  const getEntries = async (
    startDate: string | null,
    endDate: string | null
  ) => {
    try {
      const res = isUseParams
        ? await getFunction(startDate, endDate, id)
        : await getFunction(startDate, endDate);

      if (res.status === 200) {
        if (!initialPackedTableColumns) {
          const { head, body } = res.data;
          setTableDataHead(head);
          setTableDataSource(body);
          // console.log('s')
        } else {
          setTableDataSource(res.data);
          // console.log('a')
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const rangePickerHandleChange = async (dates: any) => {
    const [startDate, endDate] = dates || [null, null];
    const startDateStr = startDate ? startDate.format("DD-MM-YYYY") : null;
    const endDateStr = endDate ? endDate.format("DD-MM-YYYY") : null;

    setDates(dates);

    getEntries(startDateStr, endDateStr);
  };

  const tableIsObj = false;

  const [messageApi, contextHolder] = message.useMessage();
  const formOnFinish = async (value) => {
    const photomagnets_promo = Math.floor(
      parseInt(value.photomagnets_quantity) / 2
    );
    const photomagnets_not_promo =
      parseInt(value.photomagnets_quantity) - photomagnets_promo;
    const photomagnets_sum =
      photomagnets_not_promo * 250 + photomagnets_promo * 150;

    const cleanedData = Object.fromEntries(
        Object.entries(value).filter(([key, val]) => val !== "" && val !== null)
    );

    const localValue = value

    const sum =
      parseInt(cleanedData.actor_second_actor ? cleanedData.actor_second_actor : 0) +
      parseInt(cleanedData.add_players ? cleanedData.add_players : 0) +
      parseInt(cleanedData.birthday_congr ? cleanedData.birthday_congr : 0) -
      parseInt(cleanedData.discount_sum ? cleanedData.discount_sum : 0) +
      parseInt(cleanedData.easy_work ? cleanedData.easy_work : 0) +
      parseInt(cleanedData.night_game ? cleanedData.night_game : 0) +
      parseInt(cleanedData.video ? cleanedData.video : 0) + 
      parseInt(cleanedData.room_sum ? cleanedData.room_sum : 0) + 
      (photomagnets_sum ? cleanedData.photomagnets_quantity : 0)
      // parseInt(value.quest_cost ? value.quest_cost : 0);

    const noname1 = sum + parseInt(cleanedData.quest_cost) - parseInt(cleanedData.prepayment ? cleanedData.prepayment : 0);
    const noname2 =
      parseInt(cleanedData.cash_payment ? cleanedData.cash_payment : 0) +
      parseInt(cleanedData.cashless_payment ? cleanedData.cashless_payment : 0) -
      parseInt(cleanedData.cash_delivery ? cleanedData.cash_delivery : 0) -
      parseInt(cleanedData.cashless_delivery ? cleanedData.cashless_delivery : 0);

    
    const arrayToCheck = ['room_sum', 'prepayment', 'photomagnets_quantity', 'night_game', 'easy_work', 'discount_sum', 'cashless_payment', 'cashless_delivery', 'cash_payment', 'cash_delivery', 'birthday_congr', 'add_players', 'actor_second_actor']; // Replace with your array of keys to check

    for (let key in localValue) {
      if (arrayToCheck.includes(key) && localValue[key] === undefined) {
        localValue[key] = 0;
      }
    }

    // if (noname1 === noname2) {
      // alert("equal");
    const response = await postFunction(localValue);
    if (response.status === 201) {
      messageApi.open({
        type: "success",
        content: "запись создана",
      });
      if (dates.length !== 0) {
        getEntries(
          dates[0].format("DD-MM-YYYY"),
          dates[1].format("DD-MM-YYYY")
        );
      } else {
        getEntries(null, null);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "запись не создана",
      });
    }
    // } else {
    //   messageApi.open({
    //     type: "error",
    //     content: "неверно",
    //   });
    // }
    // } catch (error) {
      // messageApi.open({
      //   type: "error",
      //   content: "запись не создана",
      // });
    // }
  };

  const { setAccess } = useAuth();
  const logout = async () => {
    setAccess();
    localStorageRemoveItem(["refresh", "access"]);
    // navigate("/", { replace: true });
  };

  let filteredUsersFormItems = formItems;
  if (notVisibleFormItems) {
    if (notVisibleFormItems.length !== 0) {
      filteredUsersFormItems = formItems
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => !notVisibleFormItems.includes(item.name)
          ),
        }))
        .filter((group) => group.items.length > 0)
        .map((group) => ({
          ...group,
          items: group.items.map((item) => {
            if (group.items.length === 1) {
              return {
                ...item,
                spanXS: 24,
                spanSM: 24,
                spanMD: 24,
              };
            }
            return item;
          }),
        }));
    }
  }

  useEffect(() => {
    form.setFieldsValue(defaultValuesFormItems);
  }, [defaultValuesFormItems, form]);

  useEffect(() => {
    getEntries(null, null);
  }, []);

  return (
    <CMain
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      breadcrumbItems={breadcrumbItems}
      title={title}
      isRangePicker={isRangePicker}
      rangePickerHandleChange={rangePickerHandleChange}
      isAddEntry={isAddEntry}
      addEntryHandleClick={addEntryHandleClick}
      addEntryTitle={addEntryTitle}
      isCancel={isCancel}
      cancelHandleClick={cancelHandleClick}
      isCreate={isCreate}
      form={form}
    >
      {contextHolder}
      <FloatButton onClick={() => logout()} />
      <CTable
        scroll={tableScroll}
        columns={tableColumns}
        dataSource={tableDataSource}
        countingFields={tableCountingFields}
        isObj={tableIsObj}
      />
      {isAddEntry === true && (
        <CDrawer
          title={drawerTitle}
          onClose={drawerOnClose}
          open={drawerIsOpen}
          formItems={filteredUsersFormItems}
          formForm={form}
          formOnFinish={formOnFinish}
          formHandleOnChange={formHandleOnChange}
        />
      )}
    </CMain>
  );
};

export default TableFC;
