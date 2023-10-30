import { FC, useState, useEffect } from "react";

// antd | icons
import { UserOutlined, EditOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../components/template/Edit.tsx";

// api
import { getUser, putUser } from "../api/APIUtils";

// constants
import { getUsersFormItems } from "../constants/index.ts";

const EditUsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: UserOutlined,
      title: "сотрудники",
      to: "/users",
    },
    {
      icon: EditOutlined,
      title: "редактирование",
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

  return (
    <TemplateEdit
      defaultOpenKeys={["users"]}
      defaultSelectedKeys={["users"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getUser}
      putFunction={putUser}
      isUseParams={true}
      formItems={formItems}
    />
  );
};

export default EditUsersFC;
