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
  Tooltip,
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { datePickerFormat, timePickerFormat } from "../../constants";
import { getSTQuest } from "../../api/APIUtils";

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
  putFunction,
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
  operationIsAdd,
  operationIsEdit,
  operationIsDelete,
}) => {
  const { id } = isUseParams ? useParams() : { id: "" };

  const [fileList, setFileList] = useState([]);

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
      title = `${breadcrumbItems[breadcrumbItemsLength - 2].title} | ${
        breadcrumbItems[breadcrumbItemsLength - 1].title
      }`;
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

  const form2HandleOnChange = () => {};

  const [dates, setDates] = useState([]);
  const [tableDataHead, setTableDataHead] = useState([]);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  let tableColumns = [];
  let initialUnpackedTableDateColumn = {};
  let unpackedTableColumns = [];
  let tableCountingFields = [];
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

      // if (column.isFiltering) {
      //   newColumn.filters = [
      //     { text: 'квартира 404', value: 'Квартира 404' },
      //     { text: 'проклятые', value: 'Проклятые' },
      //   ];
      // }

      return newColumn;
    });
    tableCountingFields = initialPackedTableColumns
      .filter((column) => column.countable)
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
                    <div>{obj.value}</div>
                  </Tooltip>
                );
              } else {
                return <div>{obj.value}</div>;
              }
            },
          })),
        };
      }
      return { ...item, render: (obj) => {
        if (obj.tooltip !== "") {
          return (
            <Tooltip
              title={
                <div dangerouslySetInnerHTML={{ __html: obj.tooltip }} />
              }
              placement="bottomLeft"
            >
              <div>{obj.value}</div>
            </Tooltip>
          );
        } else {
          return <div>{obj.value}</div>;
        }
      }, };
    });

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

    const cleanedData = Object.fromEntries(
      Object.entries(res.data).filter(
        ([key, val]) => val !== "" && val !== null
      )
    );
    for (const key in cleanedData) {
      if (cleanedData.hasOwnProperty(key)) {
        const value = cleanedData[key];

        if (key === "date" || key === "date_of_birth") {
          const date = dayjs(value, datePickerFormat);
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
  if (tableIsOperation) {
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
        width: operationIsAdd && !operationIsEdit ? 104 : operationIsEdit && operationIsAdd ? 256 : 192,
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
  const form2OnFinish = async (value) => {
    const cleanedData = Object.fromEntries(
      Object.entries(value).filter(([key, val]) => val !== "" && val !== null)
    );
    const res = await getSTQuest(stQuestKey);

    // console.log('1', res.data)
    // console.log('2', value)

    let mergeObj = Object.assign({}, res.data, value);

    // console.log(mergeObj.quest)
    mergeObj.quest = mergeObj.quest.id;
    mergeObj.administrator = mergeObj.administrator.id;
    mergeObj.created_by = mergeObj.created_by.id;
    mergeObj.date = dayjs(mergeObj.date, "DD-MM-YYYY").format(
      "YYYY-MM-DD[T]00:00:00.000[Z]"
    );
    mergeObj.time = dayjs(mergeObj.time, "HH:mm:ss")
      .utc()
      .format("YYYY-01-01THH:mm:ss.000[Z]");
    mergeObj.actors = mergeObj.actors.map((actor) => {
      return actor.id;
    });

    cleanedData.quest = res.data.quest.id;
    cleanedData.quest_cost = res.data.quest_cost;
    cleanedData.administrator = res.data.administrator.id;
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

    const res2 = await putFunction(stQuestKey, mergeObj);
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
        getEntries(null, null);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "запись не обновлена",
      });
    }
  };

  const formOnFinish = async (value) => {
    try {
      if (breadcrumbItems[breadcrumbItems.length - 1].title == "касса") {
        value["quest"] = parseInt(id);
      }
      // let response;
      // if (value.attachment) {
      //   if (value.attachment.length > 0) {
      //     response = await postFunction(value, value.attachment[0].originFileObj)
      //   } else {
      //     response = await postFunction(value);
      //   }
      // } else {
      //   response = await postFunction(value);
      // }

      // console.log(fileList[0].originFileObj)

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
          getEntries(null, null);
        }
        form.resetFields()
      } else {
        messageApi.open({
          type: "error",
          content: "запись не создана",
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
    window.location.href = '/login';
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

  useEffect(() => {
    form.setFieldsValue(defaultValuesFormItems);
  }, [defaultValuesFormItems, form]);

  useEffect(() => {
    if (breadcrumbItems[breadcrumbItems.length - 1].title === "касса") {
      // getEntries(dayjs().format("DD-MM-YYYY"), dayjs().format("DD-MM-YYYY"));
      getEntries(null, null);
    } else {
      getEntries(null, null);
    }
  }, [id]);

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
          formForm={form}
          formItems={filteredUsersFormItems}
          formFileList={fileList}
          formSetFileList={setFileList}
          formInitialValues={formInitialValues}
          formHandleOnSelect={formHandleOnSelect}
          formHandleOnChange={formHandleOnChange}
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
