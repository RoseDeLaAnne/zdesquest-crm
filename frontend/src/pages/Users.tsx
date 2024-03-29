import { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import { UserOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../components/template/Table";

// api
import { deleteUser, getUsers, postUser } from "../api/APIUtils";

import { getUsersFormItems } from "../constants";

const UsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: UserOutlined,
      title: "сотрудники",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "имя",
      dataIndex: "first_name",
      sorting: true,
      searching: "имени",
      width: 144,
      fixed: "left",
    },
    {
      title: "фамилия",
      dataIndex: "last_name",
      sorting: true,
      searching: "фамилии",
      width: 144,
    },
    {
      title: "отчество",
      dataIndex: "middle_name",
      sorting: true,
      searching: "отчеству",
      width: 144,
    },
    {
      title: "электронная почта",
      dataIndex: "email",
      sorting: true,
      searching: "электронной почте",
      width: 192,
    },
    {
      title: "номер телефона",
      dataIndex: "phone_number",
      sorting: true,
      searching: "номеру телефона",
      width: 180,
    },
    {
      title: "номер телефона для перевода",
      dataIndex: "phone_number_for_transfer",
      sorting: true,
      searching: "номеру телефона для перевода",
      width: 280,
    },
    {
      title: "банк",
      dataIndex: "bank",
      sorting: true,
      searching: "банку",
      width: 120,
      render: (bank) => {
        if (bank !== null) {
          let color = "black";
          let formattedText = "";

          if (bank === "sberbank") {
            color = "green";
            formattedText = "сбербанк";
          } else if (bank === "tinkoff") {
            color = "yellow";
            formattedText = "тинькофф";
          } else if (bank === "alfabank") {
            color = "red";
            formattedText = "альфа-банк";
          } else if (bank === "vtb") {
            color = "blue";
            formattedText = "втб";
          }

          return <Tag color={color}>{formattedText}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "дата рождения",
      dataIndex: "date_of_birth",
      sorting: true,
      searching: "дате рождения",
    },
    {
      title: "квест",
      dataIndex: "quest",
      filtering: "quests",
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
      filtering: "roles",
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
      dataIndex: "internship_period_start",
    },
    {
      title: "окончание стажировки",
      dataIndex: "internship_period_end",
    },
    {
      title: "квест стажировочные",
      dataIndex: "internship_quest",
      render: (internship_quest) => {
        if (internship_quest !== null) {
          return <Tag color="orange">{internship_quest.name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "активен",
      dataIndex: "is_active",
      render: (is_active) => {
        let color = "red";
        let formattedText = "";

        if (is_active) {
          color = "green";
          formattedText = "да";
        } else {
          color = "red";
          formattedText = "нет";
        }

        return <Tag color={color}>{formattedText}</Tag>;
      },
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getUsersFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = () => {};

  return (
    <TemplateTable
      defaultOpenKeys={["users"]}
      defaultSelectedKeys={["users"]}
      breadcrumbItems={initialBreadcrumbItems}
      addEntryTitle={"новый сотрудник"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getUsers}
      deleteFunction={deleteUser}
      postFunction={postUser}
      isAddEntry={true}
      drawerTitle={"добавить нового сотрудника"}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
      tableScroll={{ x: 2250, y: 600 }}
      operationIsEdit={true}
      operationIsDelete={true}
    />
  );
};

export default UsersFC;
