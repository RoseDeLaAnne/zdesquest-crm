import React, { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

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
  Popconfirm,
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
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// libs
import dayjs from "dayjs";

import axios from "axios";

// api
import {
  getQuests,
  getUsers,
  getRoles,
  getUser,
  putUser,
} from "../api/APIUtils";

import { usersFormItems } from "../constants/index.ts";

// components
import EditTemplate from "../components/EditTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  // const [optionsUsers, setOptionsUsers] = useState([]);
  // const [filtersUsers, setFiltersUsers] = useState([]);
  // const [filtersQuests, setFiltersQuests] = useState([]);
  // const [optionsQuests, setOptionsQuests] = useState([]);
  // const [filtersRoles, setFiltersRoles] = useState([]);
  // const [optionsRoles, setOptionsRoles] = useState([]);
  // const fetchUsers = async () => {
  //   try {
  //     const response = await getUsers();
  //     if (response.status === 200) {
  //       const formattedOptions = response.data.map((item) => ({
  //         label: item.first_name.toLowerCase(),
  //         value: item.id,
  //       }));
  //       const formattedFilters = response.data.map((item) => ({
  //         text: item.first_name.toLowerCase(),
  //         value: item.id,
  //       }));
  //       setOptionsUsers(formattedOptions);
  //       setFiltersUsers(formattedFilters);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const fetchQuests = async () => {
  //   try {
  //     const response = await getQuests();
  //     if (response.status === 200) {
  //       const formattedOptions = response.data.map((item) => ({
  //         label: item.name.toLowerCase(),
  //         value: item.id,
  //       }));
  //       const formattedFilters = response.data.map((item) => ({
  //         text: item.name.toLowerCase(),
  //         value: item.id,
  //       }));

  //       setOptionsQuests(formattedOptions);
  //       setFiltersQuests(formattedFilters);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const fetchRoles = async () => {
  //   try {
  //     const response = await getRoles();
  //     if (response.status === 200) {
  //       const formattedOptions = response.data.map((item) => ({
  //         label: item.name.toLowerCase(),
  //         value: item.id,
  //       }));
  //       const formattedFilters = response.data.map((item) => ({
  //         text: item.name.toLowerCase(),
  //         value: item.id,
  //       }));
  //       setOptionsRoles(formattedOptions);
  //       setFiltersRoles(formattedFilters);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
  const title = `${
    initialBreadcrumbItems[initialBreadcrumbItems.length - 2].title
  } | ${initialBreadcrumbItems[initialBreadcrumbItems.length - 1].title}`;

  const [visibleFormItems, setVisibleFormItems] = useState([
    "username",
    "password",
    "quest",
  ]);

  const handleOnChange = (value, name) => {};

  // const handleOnChange = (value, name) => {
  //   if (name === "quest") {
  //     switch (value) {
  //       case "jack":
  //         setVisibleFormItems(["password", "quest"]);
  //         break;
  //       case "lucy":
  //         setVisibleFormItems(["username", "quest"]);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  //   fetchRoles();
  //   fetchQuests();
  // }, []);

  return (
    <EditTemplate
      defaultOpenKeys={["users"]}
      defaultSelectedKeys={["users"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={title}
      fetchFunction={getUser}
      putFunction={putUser}
      formItems={usersFormItems}
      visibleFormItems={visibleFormItems}
      handleOnChange={handleOnChange}
    />
  );
};

export default App;
