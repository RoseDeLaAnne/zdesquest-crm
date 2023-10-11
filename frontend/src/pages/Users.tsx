import { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../components/template/Table";

// api
import { deleteUser, getUsers, postUser } from "../api/APIUtils";

import { getUsersFormItems } from "../constants";


const UsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "сотрудники",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "логин",
      dataIndex: "username",
      key: "username",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "логину",
      },
      isCountable: false,
    },
    {
      title: "электронная почта",
      dataIndex: "email",
      key: "email",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "электронной почте",
      },
      isCountable: false,
    },
    {
      title: "номер телефона",
      dataIndex: "phone_number",
      key: "phone_number",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "номеру телефона",
      },
      isCountable: false,
    },
    {
      title: "имя",
      dataIndex: "first_name",
      key: "first_name",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "имени",
      },
      isCountable: false,
    },
    {
      title: "фамилия",
      dataIndex: "last_name",
      key: "last_name",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "фамилии",
      },
      isCountable: false,
    },
    {
      title: "отчество",
      dataIndex: "middle_name",
      key: "middle_name",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "отчеству",
      },
      isCountable: false,
    },
    {
      title: "дата рождения",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "дате рождения",
      },
      isCountable: false,
    },
    {
      title: "квест",
      dataIndex: "quest",
      key: "quest",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (quest) => {
        if (quest !== null) {
          return <Tag color="orange">{quest.name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "роли",
      dataIndex: "roles",
      key: "roles",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { roles }) => (
        <>
          {roles.map((role) => {
            return (
              <Tag color="black" key={role.id}>
                {role.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "начала стажировки",
      dataIndex: "range_staj_start",
      key: "range_staj_start",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
    },
    {
      title: "окончание стажировки",
      dataIndex: "range_staj_end",
      key: "range_staj_end",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
    },
    {
      title: "квест стажировочные",
      dataIndex: "quest_staj",
      key: "quest_staj",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (quest_staj) => {
        if (quest_staj !== null) {
          return <Tag color="orange">{quest_staj.name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "квест стажировочные",
      dataIndex: "quest_staj",
      key: "quest_staj",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (quest_staj) => {
        if (quest_staj !== null) {
          return <Tag color="orange">{quest_staj.name}</Tag>;
        } else {
          return null;
        }
      },
    },
  ];

  const [formItems, setFormItems] = useState([])
  const getFormItems = async () => {
    const res = await getUsersFormItems()
    setFormItems(res)
  }
  useEffect(() => {
    getFormItems();
  }, [])
  

  const formHandleOnChange = () => {};

  return (
    <TemplateTable
      defaultOpenKeys={["users"]}
      defaultSelectedKeys={[]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={false}
      addEntryTitle={"новый сотрудник"}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={null}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getUsers}
      deleteFunction={deleteUser}
      postFunction={postUser}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"добавить нового сотрудника"}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default UsersFC;
