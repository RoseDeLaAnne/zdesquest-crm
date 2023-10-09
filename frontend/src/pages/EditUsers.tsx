import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../components/template/Edit.tsx";

// api
import { getUser, putUser } from "../api/APIUtils";

import { getUsersFormItems } from "../constants/index.ts";

const EditUsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "сотрудники",
      to: "/users",
    },
    {
      icon: TableOutlined,
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
      // visibleFormItems={visibleFormItems}
      // handleOnChange={handleOnChange}
    />
  );
};

export default EditUsersFC;
