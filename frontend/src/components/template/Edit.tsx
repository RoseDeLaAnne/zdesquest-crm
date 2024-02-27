// libs
import dayjs from "dayjs";

import { FC, useEffect, useState } from "react";

// react-router-dom
import { useNavigate, Link, useParams } from "react-router-dom";

// antd
import { Form, message } from "antd";

// components
import CMain from "./Main";
import CForm from "../UI/Form";

// constants
import { datePickerFormat, timePickerFormat } from "../../constants";

const EditFC: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  getFunction,
  putFunction,
  isUseParams,
  formItems,
  notVisibleFormItems,
  defaultValuesFormItems,
  formHandleOnChange,
}) => {
  const [fileList, setFileList] = useState([]);

  const { id } = isUseParams ? useParams() : { id: "" };
  const navigate = useNavigate();

  const title = `${
    breadcrumbItems[breadcrumbItems.length - 2].title
  } | редактирование`;

  const cancelHandleClick = () => {
    history.back();
  };
  // const handleOnChange = async (key: number) => {};

  const getEntry = async () => {
    try {
      const res = await getFunction(id);

      if (res.status === 200) {
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
              // form.setFieldsValue({ [key]: date });
              const date = dayjs(value, datePickerFormat).utcOffset(3 * 60);
              form.setFieldsValue({ [key]: date });
            } else if (key === "time") {
              const time = dayjs(value, timePickerFormat);
              form.setFieldsValue({ [key]: time });
            } else if (key === "quest") {
              form.setFieldsValue({
                [key]:
                  value !== null
                    ? value.name.toLowerCase()
                    : value,
              });
            } else if (key === "administrator" || key === "animator" || key === "room_employee_name" || key === "who_paid") {
              form.setFieldsValue({
                [key]:
                  value !== null
                    ? `${value.first_name.toLowerCase()} ${value.last_name.toLowerCase()}`
                    : value,
              });
            } else if (key === "actors" || key === "actors_half" || key === "employees_first_time" || key === "employees" || key === "administrators_half") {
              form.setFieldsValue({
                [key]: value.map(
                  (el) =>
                    `${el.first_name.toLowerCase()} ${el.last_name.toLowerCase()}`
                ),
              });
            } else if (key === "quests") {
              form.setFieldsValue({
                [key]: value.map(
                  (el) =>
                    el.name.toLowerCase()
                ),
              });
            } else if (
              key === "user" ||
              // key === "administrator" ||
              // key === "animator" ||
              key === "created_by" ||
              // key === "room_employee_name" ||
              // key === "quest" ||
              key === "user" ||
              // key === "who_paid" ||
              key === "sub_category" ||
              key === "parent_quest" ||
              key === "category"
            ) {
              form.setFieldsValue({ [key]: value !== null ? value.id : value });
            } else if (
              // key === "administrators_half" ||
              key === "users" ||
              // key === "actors" ||
              // key === "actors_half" ||
              key === "special_versions" ||
              key === "versions" ||
              key === "roles" ||
              // key === "quests" ||
              // key === "employees_first_time" ||
              key === "quests_for_videos"
              // key === "employees"
            ) {
              form.setFieldsValue({ [key]: value.map((el) => el.id) });
            } else if (key === "attachment") {
              setFileList([
                {
                  uid: "-1",
                  name: "attachment.jpg",
                  status: "done",
                  // url: `http://localhost:8000${value}`,
                  url: `http://crm.zdesquest.ru${value}`,
                },
              ]);
            } else {
              form.setFieldsValue({ [key]: value });
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const formOnFinish = async (value: object) => {
    // console.log(fileList[0])
    // console.log(value)

    // if (fileList[0].originFileObj) {
    //   console.log('file')
    // } else {
    //   console.log('no file')
    // }

    // console.log(fileList)

    try {
      if (value.date_of_birth) {
        const date = dayjs(value.date_of_birth);
        const updatedDate = date.add(1, "day");
        value.date_of_birth = updatedDate;
      } else if (value.date) {
        const date = dayjs(value.date);
        const updatedDate = date.add(1, "day");
        value.date = updatedDate;
      }

      let response;
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          response = await putFunction(id, value, fileList[0].originFileObj);
        } else {
          response = await putFunction(id, value, {});
        }
      } else {
        response = await putFunction(id, value);
      }

      // const response = await putFunction(id, value);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "запись отредактирована",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не отредактирована",
      });
    }
  };

  useEffect(() => {
    getEntry();
  }, []);

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

  return (
    <CMain
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      breadcrumbItems={breadcrumbItems}
      title={title}
      isRangePicker={null}
      rangePickerHandleChange={null}
      isAddEntry={null}
      addEntryHandleClick={null}
      addEntryTitle={null}
      isCancel={true}
      cancelHandleClick={cancelHandleClick}
      isCreate={true}
      form={form}
    >
      {contextHolder}
      <CForm
        items={filteredUsersFormItems}
        fileList={fileList}
        setFileList={setFileList}
        form={form}
        onFinish={formOnFinish}
        handleOnChange={formHandleOnChange}
      />
    </CMain>
  );
};

export default EditFC;
