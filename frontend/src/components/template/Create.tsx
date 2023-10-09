// libs
import dayjs from "dayjs";

import { FC, useRef, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import { Form } from "antd";

// components
import CMain from "./Main";
import CForm from "../UI/Form";

const CreateFC: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  isCancel,
  isCreate,
  getFunction,
  postFunction,
  putFunction,
  isUseParams,
  formItems,
  notVisibleFormItems,
  defaultValuesFormItems,
  formHandleOnChange
}) => {
  const { id } = isUseParams ? useParams() : { id: "" };

  const title = `${
    breadcrumbItems[breadcrumbItems.length - 2].title
  } | редактирование`;

  const cancelHandleClick = () => {};

  const getEntry = async (id) => {
    try {
      const res = await getFunction(id);

      if (res.status === 200) {
        // setTableDataSource(res.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const [form] = Form.useForm();
  const formOnFinish = async (value: object) => {
    try {
      // const date = dayjs(value.date);
      // const updatedDate = date.add(1, "day");
      // value.date = updatedDate;
      const response = await postFunction(value);
      if (response.status === 200) {
        console.log('edited')
        // messageApi.open({
        //   type: "success",
        //   content: "запись отредактирована",
        // });
      }
    } catch (error) {
      // messageApi.open({
      //   type: "error",
      //   content: "запись не отредактирована",
      // });
    }
  };

  useEffect(() => {
    getEntry(id);
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
      <CForm
        items={filteredUsersFormItems}
        form={form}
        onFinish={formOnFinish}
        handleOnChange={formHandleOnChange}
      />
    </CMain>
  );
};

export default CreateFC;
