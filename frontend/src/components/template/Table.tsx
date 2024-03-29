// libs
import Highlighter from "react-highlight-words";

import { FC, useRef, useState, useEffect } from "react";

import * as XLSX from "xlsx";

// react-router-dom
import { Link, useParams, useNavigate } from "react-router-dom";

// antd
import {
  Space,
  Form,
  Button,
  Input,
  Tooltip,
  Popconfirm,
  FloatButton,
  message,
  Tag,
  Dropdown,
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
  SearchOutlined,
  LogoutOutlined,
  DashOutlined,
} from "@ant-design/icons";

// components
import CMain from "./Main";
import CTable from "../UI/Table";
import CDrawer from "../UI/Drawer";

import { localStorageRemoveItem } from "../../assets/utilities/jwt";

import { useAuth } from "../../provider/authProdiver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { datePickerFormat, timePickerFormat } from "../../constants";
import { getSTQuest, toggleQuestVideo } from "../../api/APIUtils";

import moment from "moment-timezone";

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
  tableOperationNames,
  tableOperationItems,
  getFunction,
  deleteFunction,
  postFunction,
  putFunction,
  toggleFunction,
  isUseParams,
  isAddEntry,
  drawerTitle,
  formItems,
  formItems2,
  formInitialValues,
  notVisibleFormItems,
  defaultValuesFormItems,
  formHandleOnChange,
  formHandleOnSelect,
  // formHandleOnSearch,
  operationIsAdd,
  operationIsEdit,
  operationIsDelete,
  tableIsObj,
  isExport,
  isPullOfDates,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesWhenLoading,
}) => {
  const { id } = isUseParams ? useParams() : { id: "" };

  const navigate = useNavigate();

  const [fileList, setFileList] = useState([]);
  const items: MenuProps["items"] = [
    { key: "1", label: "Верно" },
    { key: "2", label: "Неверно" },
  ];

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
  const [drawer2IsOpen, setDrawer2IsOpen] = useState(
    localStorage.getItem("drawer2IsOpen")
      ? localStorage.getItem("drawer2IsOpen") === "true"
      : false
  );

  let title = "";
  const breadcrumbItemsLength = breadcrumbItems.length;
  if (breadcrumbItemsLength !== 1) {
    if (isCancel && isCreate) {
      title = `${
        breadcrumbItems[breadcrumbItemsLength - 1].title
      } | редактирование`;
    } else {
      title = `${breadcrumbItems[breadcrumbItemsLength - 1].title}`;
      // title = `${breadcrumbItems[breadcrumbItemsLength - 2].title} | ${
      //   breadcrumbItems[breadcrumbItemsLength - 1].title
      // }`;
    }
  } else if (breadcrumbItemsLength === 1) {
    title = breadcrumbItems[0].title;
  }

  const drawerOnClose = () => {
    setDrawerIsOpen(false);
    localStorage.setItem("drawerIsOpen", "false");
  };
  const drawer2OnClose = () => {
    setDrawer2IsOpen(false);
    localStorage.setItem("drawer2IsOpen", "false");
  };
  const addEntryHandleClick = () => {
    setDrawerIsOpen(true);
    localStorage.setItem("drawerIsOpen", "true");
  };
  const cancelHandleClick = () => {};

  const handleToggle = async (type: string, key: number) => {
    const res = await toggleFunction({
      type: type,
      id: parseInt(key),
    });
    if (res.status === 200) {
      const newData = tableDataSource.filter((item) => item.key !== key);
      setTableDataSource(newData);

      if (dates.length !== 0) {
        getEntries(
          dates[0].format("DD-MM-YYYY"),
          dates[1].format("DD-MM-YYYY")
        );
      } else {
        getEntries(
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
        );
      }
    }
  };
  const handleToggle2 = async (key: number) => {
    const res = await toggleFunction(key);
    if (res.status === 200) {
      const newData = tableDataSource.filter((item) => item.key !== key);
      setTableDataSource(newData);

      if (dates2.length !== 0) {
        // getEntries(
        //   dates[0].format("DD-MM-YYYY"),
        //   dates[1].format("DD-MM-YYYY")
        // );
        getEntries(
          dates2[0], dates2[1]
        );
      } else {
        getEntries(
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
        );
      }
    }
  };

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
        getEntries(
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
        );
      }
    }
  };

  const form2HandleOnChange = () => {};

  const [dates, setDates] = useState([]);
  const [dates2, setDates2] = useState([]);
  const [tableDataHead, setTableDataHead] = useState([]);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [currentDates, setCurrentDates] = useState([]);

  let tableColumns = [];
  let initialUnpackedTableDateColumn = {};
  let unpackedTableColumns = [];
  let tableCountingFields = [];
  let tableSumFields = [];
  if (tableDateColumn === "date") {
    initialUnpackedTableDateColumn = {
      title: "дата",
      dataIndex: tableDateColumn,
      key: tableDateColumn,
      width: 140,
      sorter: (a, b) => {
        const dateA = new Date(a.date.split(".").reverse().join("-"));
        const dateB = new Date(b.date.split(".").reverse().join("-"));
        return dateA - dateB;
      },
      ...getColumnSearchProps("date", "дате"),
      // fixed: "left",
    };
  } else if (tableDateColumn === "date_time") {
    initialUnpackedTableDateColumn = {
      title: "дата/время",
      dataIndex: tableDateColumn,
      key: tableDateColumn,
      width: 140,
      ...getColumnSearchProps("date_time", "дате/времени"),
      // fixed: "left",
    };
  }
  if (initialPackedTableColumns) {
    unpackedTableColumns = initialPackedTableColumns.map((column) => {
      let newColumn = {
        title: column.title,
        dataIndex: column.dataIndex,
        key: column.dataIndex,
      };

      if (column.sorting) {
        newColumn.sorter = {
          compare: (a, b) => a[column.dataIndex] - b[column.dataIndex],
        };
      }

      if (column.searching) {
        newColumn = {
          ...newColumn,
          ...getColumnSearchProps(column.dataIndex, column.searching),
        };
      }

      if (column.width) {
        newColumn.width = column.width;
      }

      // if (column.fixed) {
      //   newColumn.fixed = column.fixed;
      // }

      if (column.render) {
        newColumn.render = column.render;
      }

      if (column.filters) {
        newColumn.filters = column.filters;
      }

      if (column.onFilter) {
        newColumn.onFilter = column.onFilter;
      }

      return newColumn;
    });
    tableCountingFields = initialPackedTableColumns
      .filter((column) => column.countable)
      .map((column) => column.dataIndex);
    tableSumFields = initialPackedTableColumns
      .filter((column) => column.inSum)
      .map((column) => column.dataIndex);
  } else {
    unpackedTableColumns = tableDataHead.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.map((child) => ({
            ...child,
            render: (obj) => {
              if (obj.tooltip !== "") {
                return (
                  <Tooltip
                    title={
                      <div dangerouslySetInnerHTML={{ __html: obj.tooltip }} />
                    }
                    placement="bottomLeft"
                  >
                    {/* <div>{obj.value}</div> */}
                    <Tag
                      color={
                        obj.status === "correctly"
                          ? "success"
                          : obj.status === "incorrectly"
                          ? "error"
                          : "default"
                      }
                    >
                      {obj.value}
                    </Tag>
                  </Tooltip>
                );
              } else {
                // return <div>{obj.value}</div>;
                return (
                  <Tag
                    color={
                      obj.status === "correctly"
                        ? "success"
                        : obj.status === "incorrectly"
                        ? "error"
                        : "default"
                    }
                  >
                    {obj.value}
                  </Tag>
                );
              }
            },
          })),
        };
      }
      return {
        ...item,
        render: (obj) => {
          if (obj.tooltip !== "") {
            return (
              <Tooltip
                title={
                  <div dangerouslySetInnerHTML={{ __html: obj.tooltip }} />
                }
                placement="bottomLeft"
              >
                {/* <div>{obj.value}</div> */}
                <Tag
                  color={
                    obj.status == "correctly"
                      ? "success"
                      : obj.status == "incorrectly"
                      ? "error"
                      : "default"
                  }
                >
                  {obj.value}
                </Tag>
              </Tooltip>
            );
          } else {
            // return <div>{obj.value}</div>;
            return (
              <Tag
                color={
                  obj.status === "correctly"
                    ? "success"
                    : obj.status === "incorrectly"
                    ? "error"
                    : "default"
                }
              >
                {obj.value}
              </Tag>
            );
          }
        },
      };
    });

    // tableCountingFields = tableDataHead.map((column) => column.dataIndex);

    tableCountingFields = tableDataHead.flatMap((item) => {
      if (item.dataIndex) {
        return item.dataIndex;
      }

      if (item.children) {
        return item.children.map((child) => child.dataIndex);
      }

      return [];
    });

    // console.log('tableCountingFields', tableCountingFields)

    // unpackedTableColumns = tableDataHead.map((column) => {
    //   // console.log(column)

    //   let newColumn = {
    //     title: column.title,
    //   };

    //   if (column.hasOwnProperty('children')) {
    //     console.log('children')
    //     newColumn.children = newColumn.children.map((newColumnItem) => {
    //       return {
    //         dataIndex: newColumnItem.dataIndex,
    //         key: newColumnItem.key,
    //         render: (obj) => {
    //           if (obj.tooltip !== "") {
    //             return (
    //               <Tooltip
    //                 title={
    //                   <div dangerouslySetInnerHTML={{ __html: obj.tooltip }} />
    //                 }
    //                 placement="bottomLeft"
    //               >
    //                 <div>{obj.value}</div>
    //               </Tooltip>
    //             );
    //           } else {
    //             return <div>{obj.value}</div>;
    //           }
    //         },
    //       }
    //     })
    //   } else {
    //     newColumn = {
    //       dataIndex: column.dataIndex,
    //       key: column.key,
    //       render: (obj) => {
    //         if (obj.tooltip !== "") {
    //           return (
    //             <Tooltip
    //               title={
    //                 <div dangerouslySetInnerHTML={{ __html: obj.tooltip }} />
    //               }
    //               placement="bottomLeft"
    //             >
    //               <div>{obj.value}</div>
    //             </Tooltip>
    //           );
    //         } else {
    //           return <div>{obj.value}</div>;
    //         }
    //       },
    //     }
    //   }

    //   return newColumn
    //   // return {
    //   //   title: column.title,
    //   //   dataIndex: column.dataIndex,
    //   //   key: column.key,
    //   //   ...getColumnSearchProps(column.dataIndex, ""),
    //   //   sorter: {
    //   //     compare: (a, b) => a[column.dataIndex] - b[column.dataIndex],
    //   //   },
    //   //   render: (obj) => {
    //   //     if (obj.tooltip !== "") {
    //   //       return (
    //   //         <Tooltip
    //   //           title={
    //   //             <div dangerouslySetInnerHTML={{ __html: obj.tooltip }} />
    //   //           }
    //   //           placement="bottomLeft"
    //   //         >
    //   //           <div>{obj.value}</div>
    //   //         </Tooltip>
    //   //       );
    //   //     } else {
    //   //       return <div>{obj.value}</div>;
    //   //     }
    //   //   },
    //   // };
    // });
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
  const [stQuestKey, setSTQuestKey] = useState();
  const [notVisibleFormItems2, setNotVisibleFormItems2] = useState([]);

  let filteredUsersFormItems2 = formItems2;

  const handleAddData = async (key) => {
    setSTQuestKey(key);
    const res = await getSTQuest(key);
    // const data = res.data

    // console.log('hello2')

    const cleanedData = Object.fromEntries(
      Object.entries(res.data).filter(
        ([key, val]) => val !== "" && val !== null
      )
    );
    for (const key in cleanedData) {
      if (cleanedData.hasOwnProperty(key)) {
        const value = cleanedData[key];

        if (key === "date" || key === "date_of_birth") {
          // const date = dayjs(value, datePickerFormat);
          // form2.setFieldsValue({ [key]: date });
          // const date = dayjs(value, datePickerFormat).utcOffset(3 * 60); // Add 3 hours for GMT+3
          const date = dayjs(value, datePickerFormat); // Add 3 hours for GMT+3
          form2.setFieldsValue({ [key]: date });
        } else if (key === "time") {
          const time = dayjs(value, timePickerFormat);
          form2.setFieldsValue({ [key]: time });
        } else if (
          key === "user" ||
          key === "administrator" ||
          key === "animator" ||
          key === "created_by" ||
          key === "room_employee_name" ||
          key === "quest" ||
          key === "user" ||
          key === "who_paid" ||
          key === "sub_category"
        ) {
          form2.setFieldsValue({ [key]: value !== null ? value.id : value });
        } else if (
          key === "actors" ||
          key === "actors_half" ||
          key === "administrators_half" ||
          key === "special_versions" ||
          key === "versions" ||
          key === "roles" ||
          key === "quests" ||
          key === "employees_first_time"
        ) {
          form2.setFieldsValue({ [key]: value.map((el) => el.id) });
        } else {
          form2.setFieldsValue({ [key]: value });
        }
      }
    }

    // if (data.video > 0) {
    //   setNotVisibleFormItems2(['video'])
    //   // setNotVisibleFormItems2(prev => [...prev, 'video'])
    // }

    // if (data.photomagnets_quantity) {
    //   setNotVisibleFormItems2(prev => [...prev, 'photomagnets_quantity'])
    // }

    // if (data.room_employee_name) {
    //   setNotVisibleFormItems2(prev => [...prev, 'room_employee_name'])
    // }

    setDrawer2IsOpen(true);
    localStorage.setItem("drawer2IsOpen", "true");
  };
  if (tableIsOperation == "actions") {
    tableColumns = [
      ...tableColumns,
      {
        title: "операция",
        dataIndex: "operation",
        key: "operation",
        render: (_, record: { key: React.Key }) =>
          tableDataSource.length >= 1 ? (
            <Space>
              <Popconfirm
                title="вы уверены?"
                onConfirm={() => handleToggle("correct", record.key)}
              >
                <a>{tableOperationNames[0]}</a>
              </Popconfirm>
              <Popconfirm
                title="вы уверены?"
                onConfirm={() => handleToggle("incorrect", record.key)}
              >
                <a>{tableOperationNames[1]}</a>
              </Popconfirm>
            </Space>
          ) : null,
        width: 144,
        fixed: "right",
      },
    ];
  } else if (tableIsOperation == "toggle") {
    tableColumns = [
      ...tableColumns,
      {
        title: "операция",
        dataIndex: "operation",
        key: "operation",
        render: (_, record: { key: React.Key }) =>
          tableDataSource.length >= 1 ? (
            <Space>
              <Popconfirm
                title="вы уверены?"
                onConfirm={() => handleToggle2(record.key)}
              >
                <a>отправить</a>
              </Popconfirm>
            </Space>
          ) : null,
        width: 144,
        fixed: "right",
      },
    ];
  } else if (tableIsOperation) {
    tableColumns = [
      ...tableColumns,
      {
        title: "операция",
        dataIndex: "operation",
        key: "operation",
        render: (_, record: { key: React.Key }) =>
          tableDataSource.length >= 1 ? (
            <Space>
              {operationIsAdd ? (
                <Link onClick={() => handleAddData(record.key)}>добавить</Link>
              ) : null}
              {operationIsEdit ? (
                <Link to={`edit/${record.key}`}>редактировать</Link>
              ) : null}
              {operationIsDelete ? (
                <Popconfirm
                  title="уверены, что хотите удалить?"
                  onConfirm={() => handleDelete(record.key)}
                >
                  <a>удалить</a>
                </Popconfirm>
              ) : null}
            </Space>
          ) : null,
        // width: operationIsAdd && operationIsEdit ? 256 : 192,
        width:
          operationIsAdd && !operationIsEdit
            ? 104
            : operationIsEdit && operationIsAdd
            ? 256
            : 192,
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
        } else {
          setTableDataSource(res.data);
          // console.log('a')
        }
      }

      if (res === 401) {
        setAccess();
        localStorageRemoveItem(["refresh", "access"]);
        navigate("/", { replace: true });
      }
    } catch (error) {
      throw error;
    }
  };
  const rangePickerHandleChange = async (dates: any) => {
    const [startDate, endDate] = dates || [null, null];
    const startDateStr = startDate ? startDate.format("DD-MM-YYYY") : null;
    const endDateStr = endDate ? endDate.format("DD-MM-YYYY") : null;

    getEntries(startDateStr, endDateStr);
  };

  const pullOfDatesOnChange = async (dates: any) => {
    const local_dates = dates.split(" - ");

    const [day_1, month_1, year_1] = local_dates[0].split(".").map(Number);
    const [day_2, month_2, year_2] = local_dates[1].split(".").map(Number);

    const str_dates = local_dates.map((date) => date.replace(/\./g, "-"));

    setDates2([str_dates[0], str_dates[1]]);
    getEntries(str_dates[0], str_dates[1]);
  };

  // const tableIsObj = false;

  const [messageApi, contextHolder] = message.useMessage();
  const form2OnFinish = async (value) => {
    // console.log("trigerred");

    const cleanedData = Object.fromEntries(
      Object.entries(value).filter(([key, val]) => val !== "" && val !== null)
    );
    const res = await getSTQuest(stQuestKey);

    // console.log('1', res.data)
    // console.log('2', value)

    let mergeObj = Object.assign({}, res.data, value);

    if (mergeObj.room_employee_name) {
      // mergeObj.room_employee_name = mergeObj.room_employee_name.id;
      mergeObj.room_employee_name =
        mergeObj.room_employee_name.first_name.toLowerCase() +
        " " +
        mergeObj.room_employee_name.last_name.toLowerCase();
    }
    if (mergeObj.administrator) {
      // mergeObj.administrator = mergeObj.administrator.id;
      mergeObj.administrator =
        mergeObj.administrator.first_name.toLowerCase() +
        " " +
        mergeObj.administrator.last_name.toLowerCase();
    }
    if (mergeObj.animator) {
      mergeObj.animator =
        mergeObj.animator.first_name.toLowerCase() +
        " " +
        mergeObj.animator.last_name.toLowerCase();
    }
    if (mergeObj.actors) {
      mergeObj.actors = mergeObj.actors.map((actor) => {
        // return actor.id;
        return (
          actor.first_name.toLowerCase() + " " + actor.last_name.toLowerCase()
        );
      });
    }
    if (mergeObj.administrators_half) {
      mergeObj.administrators_half = mergeObj.administrators_half.map(
        (administrator_half) => {
          // return administrator_half.id;
          return (
            administrator_half.first_name.toLowerCase() +
            " " +
            administrator_half.last_name.toLowerCase()
          );
        }
      );
    }

    mergeObj.quest = mergeObj.quest.name;
    // mergeObj.room_employee_name = mergeObj.room_employee_name.id;
    // mergeObj.administrator = mergeObj.administrator.id;
    mergeObj.created_by = mergeObj.created_by.id;
    mergeObj.date = dayjs(mergeObj.date, "DD-MM-YYYY").format(
      "YYYY-MM-DD[T]00:00:00.000[Z]"
    );
    mergeObj.time = dayjs(mergeObj.time, "HH:mm:ss")
      .utc()
      .format("YYYY-01-01THH:mm:ss.000[Z]");

    cleanedData.quest = res.data.quest.name;
    cleanedData.quest_cost = res.data.quest_cost;

    if (res.data.administrator) {
      cleanedData.administrator = res.data.administrator.id;
    }

    // cleanedData.administrator = res.data.administrator.id;
    cleanedData.is_video_review = cleanedData.is_video_review
      ? cleanedData.is_video_review
      : false;
    cleanedData.video_after =
      (cleanedData.video ? parseInt(cleanedData.video) : 0) +
      parseInt(res.data.video);
    cleanedData.video_after =
      (cleanedData.video ? parseInt(cleanedData.video) : 0) +
      parseInt(res.data.video);
    cleanedData.photomagnets_quantity_after =
      (cleanedData.photomagnets_quantity
        ? parseInt(cleanedData.photomagnets_quantity)
        : 0) + parseInt(res.data.photomagnets_quantity);
    cleanedData.room_sum_after =
      (cleanedData.room_sum ? parseInt(cleanedData.room_sum) : 0) +
      parseInt(res.data.room_sum);
    cleanedData.cash_delivery_after =
      (cleanedData.cash_delivery ? parseInt(cleanedData.cash_delivery) : 0) +
      parseInt(res.data.cash_delivery);
    cleanedData.cash_payment_after =
      (cleanedData.cash_payment ? parseInt(cleanedData.cash_payment) : 0) +
      parseInt(res.data.cash_payment);
    cleanedData.cashless_delivery_after =
      (cleanedData.cashless_delivery
        ? parseInt(cleanedData.cashless_delivery)
        : 0) + parseInt(res.data.cashless_delivery);
    cleanedData.cashless_payment_after =
      (cleanedData.cashless_payment
        ? parseInt(cleanedData.cashless_payment)
        : 0) + parseInt(res.data.cashless_payment);

    function setUndefinedOrNullToZero(obj) {
      for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = 0;
        }
      }
    }
    setUndefinedOrNullToZero(cleanedData);

    // console.log('mergeObj', mergeObj)

    const res2 = await putFunction(stQuestKey, mergeObj);
    // console.log(res2)
    if (res2.status === 200) {
      messageApi.open({
        type: "success",
        content: "запись обновлена",
      });
      if (dates.length !== 0) {
        getEntries(
          dates[0].format("DD-MM-YYYY"),
          dates[1].format("DD-MM-YYYY")
        );
      } else {
        getEntries(
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
          pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
        );
      }
    } else {
      messageApi.open({
        type: "error",
        content: "запись не обновлена",
      });
    }
  };

  const formOnFinish = async (value) => {
    // console.log(value.date);
    // const gmt3Timestamp = moment(value.date)
    //   .tz("Europe/Moscow")
    //   .format("YYYY-MM-DD");
    // console.log(gmt3Timestamp);
    try {
      if (breadcrumbItems[breadcrumbItems.length - 1].title == "касса") {
        value["quest"] = parseInt(id);
      }

      // value["date"] = moment(value.date)
      // .tz("Europe/Moscow")
      // .format("YYYY-MM-DD");

      let response;
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          response = await postFunction(value, fileList[0].originFileObj);
        } else {
          response = await postFunction(value, {});
        }
      } else {
        response = await postFunction(value);
      }

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
          getEntries(
            pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
            pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
          );
        }
        form.resetFields();
      } else {
        messageApi.open({
          type: "error",
          content: "запись не создана, т.к. уже существуют в базе данных",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не создана",
      });
    }
  };

  const { setAccess } = useAuth();
  const logout = async () => {
    setAccess();
    localStorageRemoveItem(["refresh", "access"]);
    window.location.href = "/login";
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

  // console.log(tableColumns)

  const exportHandleOnClick = () => {
    const fileName = "ExcelFile1";

    const data = [
      {
        date: "01.01.2000",
        value: 341,
      },
      {
        date: "02.01.2000",
        value: 531,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  useEffect(() => {
    form.setFieldsValue(defaultValuesFormItems);
  }, [defaultValuesFormItems, form]);

  useEffect(() => {
    if (breadcrumbItems[breadcrumbItems.length - 1].title === "касса") {
      // getEntries(dayjs().format("DD-MM-YYYY"), dayjs().format("DD-MM-YYYY"));
      getEntries(
        pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
        pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
      );
    } else {
      getEntries(
        pullOfDatesWhenLoading && pullOfDatesWhenLoading[0],
        pullOfDatesWhenLoading && pullOfDatesWhenLoading[1]
      );
    }

    const breadcrumbItemsLength = breadcrumbItems.length;
    if (breadcrumbItemsLength !== 1) {
      if (isCancel && isCreate) {
        title = `${
          breadcrumbItems[breadcrumbItemsLength - 1].title
        } | редактирование`;
      } else {
        title = `${breadcrumbItems[breadcrumbItemsLength - 2].title} | ${
          breadcrumbItems[breadcrumbItemsLength - 1].title
        }`;
      }
    } else if (breadcrumbItemsLength === 1) {
      title = breadcrumbItems[0].title;
    }
  }, [id]);

  return (
    <CMain
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      breadcrumbItems={breadcrumbItems}
      title={title}
      isUseParams={isUseParams}
      isRangePicker={isRangePicker}
      rangePickerHandleChange={rangePickerHandleChange}
      isAddEntry={isAddEntry}
      isExport={isExport}
      addEntryHandleClick={addEntryHandleClick}
      addEntryTitle={addEntryTitle}
      isCancel={isCancel}
      cancelHandleClick={cancelHandleClick}
      exportHandleOnClick={exportHandleOnClick}
      isCreate={isCreate}
      form={form}
      isPullOfDates={isPullOfDates}
      pullOfDatesDefaultValue={pullOfDatesDefaultValue}
      pullOfDatesOptions={pullOfDatesOptions}
      pullOfDatesOnChange={pullOfDatesOnChange}
    >
      {contextHolder}
      <FloatButton icon={<LogoutOutlined />} onClick={() => logout()} />
      <CTable
        scroll={tableScroll}
        columns={tableColumns}
        dataSource={tableDataSource}
        countingFields={tableCountingFields}
        sumFields={tableSumFields}
        isObj={tableIsObj}
      />
      {isAddEntry === true && (
        <CDrawer
          title={drawerTitle}
          onClose={drawerOnClose}
          open={drawerIsOpen}
          formForm={form}
          formItems={filteredUsersFormItems}
          formFileList={fileList}
          formSetFileList={setFileList}
          formInitialValues={formInitialValues}
          formHandleOnSelect={formHandleOnSelect}
          formHandleOnChange={formHandleOnChange}
          // formHandleOnSearch={formHandleOnSearch}
          formOnFinish={formOnFinish}
        />
      )}
      <CDrawer
        title={"добавить новую запись"}
        onClose={drawer2OnClose}
        open={drawer2IsOpen}
        formItems={filteredUsersFormItems2}
        formForm={form2}
        formOnFinish={form2OnFinish}
        formHandleOnChange={form2HandleOnChange}
      />
    </CMain>
  );
};

export default TableFC;
